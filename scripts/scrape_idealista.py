#!/usr/bin/env python3
"""
Scrape Idealista.pt Portugal listings via ScrapFly and write to data/listings.json.

Usage:
  SCRAPFLY_API_KEY=your_key python3 scripts/scrape_idealista.py
  SCRAPFLY_API_KEY=your_key python3 scripts/scrape_idealista.py --region lisbon --pages 3
"""

import asyncio
import json
import os
import re
import sys
import argparse
from pathlib import Path
from datetime import datetime

try:
    from scrapfly import ScrapeConfig, ScrapflyClient
except ImportError:
    print("Install scrapfly-sdk: pip install scrapfly-sdk")
    sys.exit(1)

try:
    from parsel import Selector
except ImportError:
    print("Install parsel: pip install parsel")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

API_KEY = os.environ.get("SCRAPFLY_API_KEY", "")
if not API_KEY:
    print("Error: set SCRAPFLY_API_KEY environment variable")
    sys.exit(1)

DATA_FILE = Path(__file__).parent.parent / "data" / "listings.json"

REGION_MAP = {
    "lisbon":        "https://www.idealista.pt/comprar-casas/lisboa/",
    "porto":         "https://www.idealista.pt/comprar-casas/porto/",
    "algarve":       "https://www.idealista.pt/comprar-casas/faro/",
    "silver-coast":  "https://www.idealista.pt/comprar-casas/leiria/",
    "alentejo":      "https://www.idealista.pt/comprar-casas/evora/",
}

# Map Idealista district slugs back to our region keys
DISTRICT_TO_REGION = {
    "lisboa": "lisbon",
    "porto":  "porto",
    "faro":   "algarve",
    "leiria": "silver-coast",
    "evora":  "alentejo",
    "évora":  "alentejo",
}

# ---------------------------------------------------------------------------
# Scraping helpers
# ---------------------------------------------------------------------------

async def scrape_search_page(client: ScrapflyClient, url: str) -> list[dict]:
    """Scrape one search results page, return list of partial listing dicts."""
    result = await client.async_scrape(ScrapeConfig(
        url=url,
        asp=True,
        country="PT",
        render_js=True,
    ))
    sel = Selector(result.content)
    items = []
    for article in sel.css("article.item"):
        link = article.css("a.item-link::attr(href)").get("")
        title = article.css("a.item-link::attr(title)").get("").strip()
        price_raw = article.css("span.item-price::text").get("").strip()
        price = parse_price(price_raw)
        size_raw = article.css("span.item-detail:contains('m²')::text").get("").strip()
        size = parse_size(size_raw)
        rooms_raw = article.css("span.item-detail:contains('quart')::text, span.item-detail:contains('assoalh')::text").get("")
        rooms = parse_rooms(rooms_raw)

        if not link or not title:
            continue

        full_url = f"https://www.idealista.pt{link}" if link.startswith("/") else link
        items.append({
            "_url": full_url,
            "title": title,
            "price": price,
            "size_sqm": size,
            "bedrooms": rooms,
        })
    return items


async def scrape_property_page(client: ScrapflyClient, url: str) -> dict:
    """Scrape individual property detail page."""
    result = await client.async_scrape(ScrapeConfig(
        url=url,
        asp=True,
        country="PT",
        render_js=True,
    ))
    sel = Selector(result.content)

    title = sel.css("h1.main-info__title::text, span.main-info__title-main::text").get("").strip()
    price_raw = sel.css("span.info-data-price::text").get("").strip()
    price = parse_price(price_raw)

    description = " ".join(sel.css("div.comment p::text").getall()).strip()

    # Location
    address = sel.css("li.header-map-list::text").get("").strip()
    city = ""
    neighbourhood = ""
    breadcrumbs = sel.css("li.breadcrumb-item a::text").getall()
    if len(breadcrumbs) >= 2:
        city = breadcrumbs[-1].strip()
        neighbourhood = breadcrumbs[-2].strip() if len(breadcrumbs) >= 3 else ""

    # Details
    details = sel.css("div.details-property-feature-one li::text, div.details-property-feature-two li::text").getall()
    details = [d.strip() for d in details if d.strip()]

    size_sqm = 0
    bedrooms = 0
    bathrooms = 0
    prop_type = "apartment"
    for d in details:
        if "m²" in d:
            size_sqm = parse_size(d)
        m = re.search(r"(\d+)\s*quart", d, re.I)
        if m:
            bedrooms = int(m.group(1))
        m = re.search(r"(\d+)\s*casa.*banho", d, re.I)
        if m:
            bathrooms = int(m.group(1))
        if re.search(r"moradia|vivenda|villa", d, re.I):
            prop_type = "villa"
        elif re.search(r"apartamento|flat|studio|t0|t1|t2|t3|t4", d, re.I):
            prop_type = "apartment"
        elif re.search(r"quinta|herdade|monte", d, re.I):
            prop_type = "farmhouse"

    # Images
    images = sel.css("picture img::attr(src), div.gallery img::attr(src)").getall()
    images = [i for i in images if "placeholder" not in i.lower()][:10]

    # Infer region from URL
    region = "lisbon"
    for district, r in DISTRICT_TO_REGION.items():
        if district in url.lower():
            region = r
            break

    # Build slug from title
    slug = slugify(title) or slugify(url.split("/")[-2] or url.split("/")[-1])

    return {
        "id": slug,
        "slug": slug,
        "title": title or "Property in Portugal",
        "price": price,
        "currency": "EUR",
        "region": region,
        "city": city,
        "neighbourhood": neighbourhood,
        "address": address or city,
        "type": prop_type,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "size_sqm": size_sqm,
        "floor": None,
        "description": description[:1500] if description else f"Property for sale in {city}, Portugal.",
        "features": details[:12],
        "images": images,
        "idealista_url": url,
        "listed_at": datetime.today().strftime("%Y-%m-%d"),
        "updated_at": datetime.today().strftime("%Y-%m-%d"),
    }


# ---------------------------------------------------------------------------
# Parse helpers
# ---------------------------------------------------------------------------

def parse_price(raw: str) -> int:
    digits = re.sub(r"[^\d]", "", raw)
    return int(digits) if digits else 0


def parse_size(raw: str) -> int:
    m = re.search(r"(\d[\d\.,]*)", raw.replace(".", "").replace(",", ""))
    return int(m.group(1)) if m else 0


def parse_rooms(raw: str) -> int:
    m = re.search(r"(\d+)", raw)
    return int(m.group(1)) if m else 0


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text[:80].strip("-")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

async def main(regions: list[str], pages_per_region: int):
    client = ScrapflyClient(key=API_KEY)

    # Load existing listings so we can merge / deduplicate
    existing: list[dict] = []
    if DATA_FILE.exists():
        with open(DATA_FILE) as f:
            existing = json.load(f)
    existing_urls = {l.get("idealista_url") for l in existing if l.get("idealista_url")}

    new_listings: list[dict] = []

    for region in regions:
        base_url = REGION_MAP.get(region)
        if not base_url:
            print(f"Unknown region: {region}. Valid: {list(REGION_MAP.keys())}")
            continue

        print(f"\n--- Region: {region} ---")
        property_urls: list[str] = []

        for page in range(1, pages_per_region + 1):
            url = base_url if page == 1 else f"{base_url}pagina-{page}.htm"
            print(f"  Scanning search page {page}: {url}")
            try:
                items = await scrape_search_page(client, url)
                print(f"    Found {len(items)} listings")
                for item in items:
                    if item["_url"] not in existing_urls:
                        property_urls.append(item["_url"])
            except Exception as e:
                print(f"    Error on search page {page}: {e}")
                break

        print(f"  Scraping {len(property_urls)} new property pages...")
        for i, prop_url in enumerate(property_urls, 1):
            print(f"  [{i}/{len(property_urls)}] {prop_url}")
            try:
                listing = await scrape_property_page(client, prop_url)
                if listing["title"] and listing["price"] > 0:
                    new_listings.append(listing)
                    existing_urls.add(prop_url)
            except Exception as e:
                print(f"    Error: {e}")

    # Merge and save
    all_listings = existing + new_listings
    # Deduplicate by slug, keep most recent
    seen_slugs: dict[str, dict] = {}
    for l in all_listings:
        slug = l.get("slug", "")
        if slug not in seen_slugs:
            seen_slugs[slug] = l

    final = list(seen_slugs.values())
    with open(DATA_FILE, "w") as f:
        json.dump(final, f, indent=2, ensure_ascii=False)

    print(f"\nDone. {len(new_listings)} new listings scraped. {len(final)} total in {DATA_FILE}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scrape Idealista.pt listings")
    parser.add_argument("--region", nargs="+", default=list(REGION_MAP.keys()), help="Regions to scrape")
    parser.add_argument("--pages", type=int, default=2, help="Pages per region (default: 2, ~60 listings/page)")
    args = parser.parse_args()

    asyncio.run(main(args.region, args.pages))
