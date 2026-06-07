#!/usr/bin/env python3
"""
Generate on-brand Portugal imagery with OpenAI gpt-image-1 (the engine behind
ChatGPT's image generation). Saves full-res PNG + optimized JPG to public/images/,
and derives small square thumbnails for the region panel.

Usage:
  OPENAI_API_KEY=sk-... python3 scripts/generate_images.py
  OPENAI_API_KEY=sk-... python3 scripts/generate_images.py --only lisbon porto
"""
import os
import sys
import json
import base64
import argparse
import urllib.request
from io import BytesIO
from PIL import Image

API_URL = "https://api.openai.com/v1/images/generations"
MODEL = "gpt-image-1"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images")

# Shared style suffix keeps every image visually consistent and on-brand:
# warm editorial real-estate marketing photography, golden Mediterranean light.
STYLE = (
    "Photorealistic editorial real-estate marketing photograph. Warm golden-hour "
    "Mediterranean light, natural colours, soft shadows, high dynamic range, sharp "
    "detail, professional architectural photography. No text, no watermark, no people "
    "in the foreground, no logos."
)

# size: gpt-image-1 supports 1024x1024, 1536x1024 (landscape), 1024x1536 (portrait)
WIDE = "1536x1024"
SQUARE = "1024x1024"

IMAGES = [
    # --- Wides: hero slideshow + region headers ---
    ("lisbon", WIDE,
     "Wide cinematic aerial view of Lisbon, Portugal at golden hour. Pastel terracotta "
     "rooftops cascading down hills toward the Tagus river, the red 25 de Abril suspension "
     "bridge in the distance, the Alfama district, yellow historic trams, calm river water."),
    ("porto", WIDE,
     "Wide view of Porto, Portugal along the Douro river at golden hour. The colourful "
     "Ribeira waterfront houses stacked on the hillside, the iron Dom Luis I double-deck "
     "bridge, traditional rabelo boats on the river, port wine cellars across the water."),
    ("algarve", WIDE,
     "Wide view of the Algarve coast, southern Portugal at golden hour. Dramatic golden "
     "limestone sea cliffs, hidden sandy coves, turquoise Atlantic water, the Benagil sea "
     "caves, a whitewashed villa with a pool on the clifftop."),
    ("silver-coast", WIDE,
     "Wide view of Portugal's Silver Coast at golden hour. The medieval walled town of "
     "Obidos with whitewashed houses and red roofs, rolling green countryside, a long "
     "Atlantic surf beach in the distance, soft warm light."),
    ("alentejo", WIDE,
     "Wide view of the Alentejo wine country, Portugal at golden hour. Rolling vineyards "
     "and golden wheat plains, cork oak trees, a traditional whitewashed Monte farmhouse "
     "with terracotta roof, the historic city of Evora with its Roman temple in the distance."),
    ("guide-portugal", WIDE,
     "Wide aspirational lifestyle view of Portugal at golden hour: a sun-drenched coastal "
     "town with whitewashed houses, blue and white azulejo tiled walls, bougainvillea, "
     "cobblestone streets, the Atlantic ocean beyond. Inviting and warm."),

    # --- Listing photos (match the 6 seed listings in listings.json) ---
    ("listing-chiado-lisbon", SQUARE,
     "Bright elegant interior of a renovated 2-bedroom apartment in Chiado, Lisbon. High "
     "ceilings, restored hardwood floors, tall French windows with wrought-iron Juliet "
     "balconies overlooking a historic street, tasteful modern Portuguese furniture, warm "
     "natural light."),
    ("listing-ribeira-porto", SQUARE,
     "Cozy stylish studio apartment in the Ribeira district of Porto. Exposed stone wall, "
     "compact modern kitchen, a window with a view of the colourful Ribeira waterfront and "
     "the Douro river, warm interior light, characterful and inviting."),
    ("listing-albufeira-algarve", SQUARE,
     "Exterior of a modern 4-bedroom luxury villa with a private infinity pool in Albufeira, "
     "Algarve. Whitewashed walls, large glass doors, sun loungers and palm trees, blue "
     "Atlantic sea view, bright Mediterranean afternoon light."),
    ("listing-alfama-lisbon", SQUARE,
     "Charming townhouse with river views in the Alfama district of Lisbon. Traditional "
     "facade with azulejo tiles, a small terrace overlooking the red rooftops and the Tagus "
     "river, terracotta pots with flowers, warm golden light."),
    ("listing-obidos-cottage", SQUARE,
     "Restored traditional stone cottage near Obidos on Portugal's Silver Coast. Honey-coloured "
     "stone walls, blue-trimmed windows, a rustic wooden door, a garden with olive trees and "
     "lavender, rolling green countryside behind, soft afternoon light."),
    ("listing-evora-farmhouse", SQUARE,
     "Traditional Alentejo farmhouse (Monte) with a vineyard near Evora, Portugal. Whitewashed "
     "walls with a yellow trim and terracotta roof, rows of grapevines, cork oak trees, a "
     "stone terrace, golden countryside light."),
]

# Region thumbnails derived (center-cropped square) from these wides:
THUMB_FROM = {
    "lisbon": "lisbon", "porto": "porto", "algarve": "algarve",
    "silver-coast": "silver-coast", "alentejo": "alentejo",
}


def generate(name, size, prompt, api_key):
    body = json.dumps({
        "model": MODEL,
        "prompt": f"{prompt} {STYLE}",
        "size": size,
        "quality": "high",
        "n": 1,
    }).encode()
    req = urllib.request.Request(
        API_URL, data=body,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=300) as r:
        data = json.loads(r.read())
    b64 = data["data"][0].get("b64_json")
    if not b64:
        raise RuntimeError(f"no image data for {name}: {data['data'][0]}")
    return Image.open(BytesIO(base64.b64decode(b64))).convert("RGB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", help="generate only these names")
    args = ap.parse_args()

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        sys.exit("set OPENAI_API_KEY")

    os.makedirs(OUT_DIR, exist_ok=True)
    targets = [x for x in IMAGES if not args.only or x[0] in args.only]

    saved = {}
    for i, (name, size, prompt) in enumerate(targets, 1):
        print(f"[{i}/{len(targets)}] generating {name} ({size}) ...", flush=True)
        try:
            img = generate(name, size, prompt, api_key)
        except Exception as e:
            print(f"  FAILED {name}: {e}", flush=True)
            continue
        png_path = os.path.join(OUT_DIR, f"{name}.png")
        jpg_path = os.path.join(OUT_DIR, f"{name}.jpg")
        img.save(png_path)
        img.save(jpg_path, "JPEG", quality=82, optimize=True)
        saved[name] = img
        kb = os.path.getsize(jpg_path) // 1024
        print(f"  saved {name}.jpg ({kb} KB) + .png", flush=True)

    # Derive square region thumbnails (480px) from the wides we just made / on disk
    for thumb_name, src_name in THUMB_FROM.items():
        src = saved.get(src_name)
        if src is None:
            p = os.path.join(OUT_DIR, f"{src_name}.png")
            if not os.path.exists(p):
                continue
            src = Image.open(p).convert("RGB")
        w, h = src.size
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        sq = src.crop((left, top, left + side, top + side)).resize((480, 480), Image.LANCZOS)
        tp = os.path.join(OUT_DIR, f"thumb-{thumb_name}.jpg")
        sq.save(tp, "JPEG", quality=80, optimize=True)
        print(f"  thumb-{thumb_name}.jpg derived", flush=True)

    print("DONE.", flush=True)


if __name__ == "__main__":
    main()
