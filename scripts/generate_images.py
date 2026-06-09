#!/usr/bin/env python3
"""
Generate on-brand Portugal imagery with MiniMax image-01, with a SAFE PREVIEW workflow:

  1. Generate -> writes to image-staging/ (NOT the live site) + builds a
     preview.html contact sheet and opens it in your browser.
  2. Review the gallery. Regenerate any you don't like with --only <name>.
  3. Promote the keepers into public/images/ (the live folder) with --promote.

MiniMax is funded by the coding-plan key (sk-cp), so generation is effectively free
(no per-image cost beyond the existing subscription) — that's why it's the only backend.

Usage:
  # generate everything into staging, open the preview gallery
  python3 scripts/generate_images.py

  # regenerate just a couple (rebuilds the gallery)
  python3 scripts/generate_images.py --only lisbon porto

  # happy with staging -> copy into the live public/images/ folder
  python3 scripts/generate_images.py --promote

  # promote only specific ones
  python3 scripts/generate_images.py --promote --only lisbon
"""
import os
import sys
import json
import time
import shutil
import argparse
import subprocess
import urllib.request
from io import BytesIO
from html import escape
from PIL import Image

# MiniMax image generation (model "image-01"). Uses the coding-plan key (sk-cp) which has
# image credits bundled with the subscription. See reference_api_keys.md.
MINIMAX_IMG_URL = "https://api.minimax.io/v1/image_generation"
MINIMAX_KEY = ("sk-cp-kP5LL6Wi4s-WsKji435cUjrY8137njNT9T_3t2hh3ASEf0BFrHkSDWJs8qn61v"
               "VEvxyx5oIrknMSegYNuACYl04MfoOMq0PA58heBel1nEQcdVgsWOEjXIw")
# Logical size -> MiniMax aspect_ratio (WIDE = landscape hero/region, SQUARE = listing)
SIZE_TO_ASPECT = {"1536x1024": "3:2", "1024x1024": "1:1", "1024x1536": "2:3"}
# Logical size -> explicit width x height in pixels. image-01 supports 512-2048 px on each
# side (must be divisible by 8); passing width/height instead of aspect_ratio gets us the
# model's MAX resolution (~75% more pixels than the aspect_ratio default) for crisper heroes.
# Note: MiniMax has a ~60s server-side render timeout. ~2.8 MP (e.g. 2048x1368) renders
# reliably; 2048x2048 (4.2 MP) consistently times out. So squares/portraits are capped at
# ~2.77 MP (1664x1664) to match the proven-working load while staying well above the old 1024px.
SIZE_TO_WH = {
    "1536x1024": (2048, 1368),   # 3:2 landscape (~2.80 MP)
    "1024x1024": (1664, 1664),   # 1:1 square   (~2.77 MP)
    "1024x1536": (1664, 2048),   # 2:3 portrait (~3.41 MP) -- unused, kept for completeness
}
# Best-of-N: generate this many candidates per prompt and keep them all so the strongest can
# be picked. image-01 allows up to 9/request; 3 is a good quality-vs-speed balance. Candidate 1
# becomes the default active pick ({name}.jpg); the rest are saved as {name}__c2.jpg, etc.
N_CANDIDATES = 3
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
STAGING_DIR = os.path.join(ROOT, "image-staging")   # preview only, gitignored
LIVE_DIR = os.path.join(ROOT, "public", "images")    # served + committed

# Shared style suffix. Priorities, in order: (1) hyper-realism — indistinguishable from
# an actual photograph; (2) natural, UNEXAGGERATED lighting and colour (no HDR look, no
# oversaturation, no orange/golden cast); (3) faithful to the REAL place — accurate real-world
# architecture, geography and scale, NO invented, fake, fantastical or embellished elements.
STYLE = (
    "Hyper-realistic photograph, indistinguishable from a real photo taken on a full-frame "
    "DSLR with a 35mm lens. Natural, soft, unexaggerated daylight and realistic neutral white "
    "balance — not oversaturated, not HDR, no orange or golden colour cast. True-to-life colours "
    "and contrast. Depict the real location accurately and faithfully, with correct real-world "
    "architecture, materials, geography and scale; do NOT invent, add or exaggerate any elements, "
    "no fantastical or surreal details, nothing that would not actually be there. Realistic "
    "textures, accurate reflections, correct proportions. No text, no watermark, no logos, no "
    "people in the foreground."
)

WIDE = "1536x1024"
SQUARE = "1024x1024"

IMAGES = [
    # --- Wides: hero slideshow + region headers ---
    ("lisbon", WIDE,
     "Wide cinematic aerial view of Lisbon, Portugal in bright natural daylight under a clear "
     "blue sky. Pastel and white buildings with terracotta rooftops cascading down hills toward "
     "the blue Tagus river, the red 25 de Abril suspension bridge in the distance, the Alfama "
     "district, a yellow historic tram, calm river water."),
    ("porto", WIDE,
     "Wide view of Porto, Portugal along the Douro river in bright natural daylight, clear sky. "
     "The colourful Ribeira waterfront houses stacked on the hillside, the iron Dom Luis I "
     "double-deck bridge, traditional rabelo boats on the river, port wine cellars across the water."),
    ("algarve", WIDE,
     "Wide view of the Algarve coast, southern Portugal in bright natural daylight under a clear "
     "blue sky. Dramatic golden limestone sea cliffs, hidden sandy coves, turquoise Atlantic "
     "water, the Benagil sea caves, a whitewashed villa with a pool on the clifftop."),
    ("silver-coast", WIDE,
     "Wide view of Portugal's Silver Coast in bright natural daylight, clear sky. The medieval "
     "walled town of Obidos with whitewashed houses and red roofs, rolling green countryside, a "
     "long Atlantic surf beach in the distance."),
    ("alentejo", WIDE,
     "Wide view of the Alentejo wine country, Portugal in bright natural daylight, clear sky. "
     "Rolling vineyards and golden wheat plains, cork oak trees, a traditional whitewashed Monte "
     "farmhouse with terracotta roof, the historic city of Evora with its Roman temple in the distance."),
    ("guide-portugal", WIDE,
     "Wide aspirational lifestyle view of Portugal in bright natural daylight: a sunlit coastal "
     "town with whitewashed houses, blue and white azulejo tiled walls, bougainvillea, "
     "cobblestone streets, the blue Atlantic ocean beyond. Inviting and clean."),

    # --- Listing photos (match the 6 seed listings in listings.json) ---
    ("listing-chiado-lisbon", SQUARE,
     "Bright airy interior of a renovated 2-bedroom apartment in Chiado, Lisbon, lit by balanced "
     "natural daylight. High ceilings, restored light hardwood floors, tall French windows with "
     "wrought-iron Juliet balconies overlooking a historic street, tasteful neutral modern "
     "Portuguese furniture."),
    ("listing-ribeira-porto", SQUARE,
     "Cozy stylish studio apartment in the Ribeira district of Porto, in natural daylight. Exposed "
     "stone wall, compact modern kitchen, a window with a view of the colourful Ribeira waterfront "
     "and the Douro river, characterful and inviting."),
    ("listing-albufeira-algarve", SQUARE,
     "Exterior of a modern 4-bedroom luxury villa with a private infinity pool in Albufeira, "
     "Algarve, in bright natural daylight under a clear blue sky. Whitewashed walls, large glass "
     "doors, sun loungers and palm trees, blue Atlantic sea view."),
    ("listing-alfama-lisbon", SQUARE,
     "Charming townhouse with river views in the Alfama district of Lisbon, in natural daylight. "
     "Traditional facade with azulejo tiles, a small terrace overlooking the red rooftops and the "
     "Tagus river, terracotta pots with flowers."),
    ("listing-obidos-cottage", SQUARE,
     "Restored traditional stone cottage near Obidos on Portugal's Silver Coast, in natural "
     "daylight. Honey-coloured stone walls, blue-trimmed windows, a rustic wooden door, a garden "
     "with olive trees and lavender, rolling green countryside behind."),
    ("listing-evora-farmhouse", SQUARE,
     "Traditional Alentejo farmhouse (Monte) with a vineyard near Evora, Portugal, in bright "
     "natural daylight. Whitewashed walls with a yellow trim and terracotta roof, rows of "
     "grapevines, cork oak trees, a stone terrace."),
]

# Region thumbnails derived (center-cropped square) from these wides:
THUMB_FROM = {
    "lisbon": "lisbon", "porto": "porto", "algarve": "algarve",
    "silver-coast": "silver-coast", "alentejo": "alentejo",
}

PROMPTS = {name: prompt for name, _, prompt in IMAGES}


def _generate_minimax(name, size, prompt, n):
    # prompt_optimizer=False so MiniMax does NOT rewrite/embellish our prompt — keeps it
    # faithful to the real scene (aligns with the STYLE "no invented elements" directive).
    # width/height (not aspect_ratio) -> full 2048px resolution. n -> best-of-N candidates.
    w, h = SIZE_TO_WH.get(size, (1024, 1024))
    body = json.dumps({
        "model": "image-01",
        "prompt": f"{prompt} {STYLE}",
        "width": w,
        "height": h,
        "n": n,
        "prompt_optimizer": False,
        "response_format": "url",
    }).encode()
    req = urllib.request.Request(
        MINIMAX_IMG_URL, data=body,
        headers={"Authorization": f"Bearer {MINIMAX_KEY}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=300) as r:
        data = json.loads(r.read())
    br = data.get("base_resp", {})
    if br.get("status_code") != 0:
        raise RuntimeError(f"minimax error for {name}: {br.get('status_code')} {br.get('status_msg')}")
    urls = (data.get("data") or {}).get("image_urls") or []
    if not urls:
        raise RuntimeError(f"no image url for {name}: {data}")
    imgs = []
    for u in urls:
        with urllib.request.urlopen(u, timeout=120) as r:
            imgs.append(Image.open(BytesIO(r.read())).convert("RGB"))
    return imgs


def generate(name, size, prompt, n=1, retries=4):
    """Return a list of candidate PIL images (length up to n)."""
    last = None
    for attempt in range(1, retries + 1):
        try:
            return _generate_minimax(name, size, prompt, n)
        except Exception as e:
            last = e
            if attempt < retries:
                wait = attempt * 8
                print(f"   retry {attempt}/{retries - 1} for {name}: {str(e)[:90]} -> {wait}s", flush=True)
                time.sleep(wait)
    raise last


def derive_thumbs(out_dir, saved):
    for thumb_name, src_name in THUMB_FROM.items():
        src = saved.get(src_name)
        if src is None:
            p = os.path.join(out_dir, f"{src_name}.jpg")
            if not os.path.exists(p):
                continue
            src = Image.open(p).convert("RGB")
        w, h = src.size
        side = min(w, h)
        left, top = (w - side) // 2, (h - side) // 2
        sq = src.crop((left, top, left + side, top + side)).resize((480, 480), Image.LANCZOS)
        sq.save(os.path.join(out_dir, f"thumb-{thumb_name}.jpg"), "JPEG", quality=80, optimize=True)


def custom_prompts_path(out_dir):
    return os.path.join(out_dir, "_custom_prompts.json")


def load_custom_prompts(out_dir):
    p = custom_prompts_path(out_dir)
    if os.path.exists(p):
        try:
            return json.load(open(p))
        except Exception:
            return {}
    return {}


def build_preview(out_dir):
    """Write a contact-sheet preview.html listing every image in the staging folder."""
    wides = [n for n, s, _ in IMAGES if s == WIDE]
    listings = [n for n, s, _ in IMAGES if s == SQUARE]
    thumbs = [f"thumb-{t}" for t in THUMB_FROM]
    custom = load_custom_prompts(out_dir)

    # Any staged .jpg that isn't a known wide/listing/thumb is a custom one-off.
    # Candidate files ({name}__c2.jpg etc.) are NOT one-offs — exclude them here.
    known = set(wides) | set(listings) | set(thumbs)
    extras = sorted(
        f[:-4] for f in os.listdir(out_dir)
        if f.endswith(".jpg") and "__c" not in f and f[:-4] not in known
    )

    def candidate_strip(name):
        """Thumbnails of every candidate so the strongest can be picked."""
        cands = sorted(
            f for f in os.listdir(out_dir)
            if f.startswith(f"{name}__c") and f.endswith(".jpg")
        )
        if len(cands) <= 1:
            return ""
        chips = ""
        for f in cands:
            k = f.split("__c")[1][:-4]
            chips += (
                f'<a href="{f}" target="_blank" title="candidate {k}">'
                f'<img src="{f}" alt="candidate {k}" loading="lazy">'
                f'<span>c{k}</span></a>'
            )
        return (
            f'<div class="cands">{chips}</div>'
            f'<p class="pickhint">To use a different one, tell Claude e.g. '
            f'"set {escape(name)} to candidate 2".</p>'
        )

    def card(name, is_thumb=False):
        jpg = f"{name}.jpg"
        if not os.path.exists(os.path.join(out_dir, jpg)):
            return ""
        prompt = "" if is_thumb else (PROMPTS.get(name) or custom.get(name, ""))
        target = f"public/images/{jpg}"
        prompt_html = (
            f'<p class="prompt">{escape(prompt)}</p>' if prompt else
            '<p class="prompt muted">derived (center-crop of the matching wide)</p>'
        )
        cands_html = "" if is_thumb else candidate_strip(name)
        return f"""
        <figure>
          <a href="{jpg}" target="_blank"><img src="{jpg}" alt="{escape(name)}" loading="lazy"></a>
          <figcaption>
            <strong>{escape(name)}</strong>
            <code>{escape(target)}</code>
            {prompt_html}
            {cands_html}
          </figcaption>
        </figure>"""

    def section(title, names, is_thumb=False):
        cards = "".join(card(n, is_thumb) for n in names)
        if not cards.strip():
            return ""
        return f'<h2>{escape(title)}</h2><div class="grid">{cards}</div>'

    html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Portugal Real Estate — image preview</title>
<style>
  :root {{ --ink:#1a1a1a; --muted:#8a8a8a; --border:#ddd8d0; --accent:#c2622a; --surface:#fefcfa; }}
  * {{ box-sizing:border-box; }}
  body {{ font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif; color:var(--ink); margin:0; background:#faf8f4; }}
  header {{ padding:28px 32px; border-bottom:1px solid var(--border); background:#fff; position:sticky; top:0; z-index:2; }}
  header h1 {{ margin:0 0 4px; font-size:20px; }}
  header p {{ margin:0; color:var(--muted); font-size:13px; }}
  main {{ padding:24px 32px 64px; max-width:1280px; margin:0 auto; }}
  h2 {{ font-size:13px; text-transform:uppercase; letter-spacing:1.5px; color:var(--muted); margin:36px 0 14px; }}
  .grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }}
  .grid.thumbs {{ grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); }}
  figure {{ margin:0; background:#fff; border:1px solid var(--border); display:flex; flex-direction:column; }}
  figure img {{ width:100%; height:auto; display:block; background:#e8e2d9; }}
  figcaption {{ padding:12px 14px 14px; }}
  figcaption strong {{ font-size:13px; display:block; }}
  figcaption code {{ font-size:11px; color:var(--accent); display:block; margin:3px 0 8px; word-break:break-all; }}
  .prompt {{ font-size:12px; color:#555; line-height:1.5; margin:0; }}
  .prompt.muted {{ color:var(--muted); font-style:italic; }}
  .cands {{ display:flex; gap:6px; margin-top:10px; flex-wrap:wrap; }}
  .cands a {{ position:relative; display:block; width:64px; height:48px; border:1px solid var(--border); overflow:hidden; }}
  .cands img {{ width:100%; height:100%; object-fit:cover; display:block; }}
  .cands span {{ position:absolute; bottom:0; right:0; background:rgba(0,0,0,0.65); color:#fff; font-size:10px; padding:1px 4px; }}
  .pickhint {{ font-size:11px; color:var(--muted); margin:6px 0 0; }}
  .tip {{ background:#fff; border:1px solid var(--border); border-left:3px solid var(--accent); padding:14px 16px; font-size:13px; line-height:1.6; margin-top:20px; }}
  .tip code {{ background:var(--surface); padding:2px 6px; border:1px solid var(--border); }}
</style></head>
<body>
  <header>
    <h1>Portugal Real Estate — image preview</h1>
    <p>These are in <code>image-staging/</code> only. The live site is untouched until you promote them.</p>
  </header>
  <main>
    <div class="tip">
      Don't like one? Tell Filipe / Claude the name (e.g. <code>porto</code>) to regenerate it.<br>
      Happy with everything? Promote into the live folder with
      <code>python3 scripts/generate_images.py --promote</code>.
    </div>
    {section("Custom / one-off", extras)}
    {section("Hero & region wides (2048×1368)", wides)}
    {section("Listing photos (2048×2048)", listings)}
    <h2>Region thumbnails (480px, derived)</h2>
    <div class="grid thumbs">{''.join(card(t, is_thumb=True) for t in thumbs)}</div>
  </main>
</body></html>"""
    path = os.path.join(out_dir, "preview.html")
    with open(path, "w") as f:
        f.write(html)
    return path


def promote(names_filter):
    """Copy approved staging .jpg files into the live public/images/ folder."""
    if not os.path.isdir(STAGING_DIR):
        sys.exit("nothing to promote — run a generation first (image-staging/ is empty)")
    os.makedirs(LIVE_DIR, exist_ok=True)
    moved = 0
    for fn in sorted(os.listdir(STAGING_DIR)):
        if not fn.endswith(".jpg"):
            continue
        if "__c" in fn:   # candidate alternates are staging-only, never promoted
            continue
        base = fn[:-4]
        if names_filter and not (base in names_filter or base.replace("thumb-", "") in names_filter):
            continue
        shutil.copy2(os.path.join(STAGING_DIR, fn), os.path.join(LIVE_DIR, fn))
        print(f"  promoted {fn} -> public/images/{fn}")
        moved += 1
    print(f"PROMOTED {moved} image(s) into public/images/. Build + deploy to publish.")


def pick(name, k):
    """Make candidate k the active pick for `name` ({name}.jpg) and refresh thumbs+preview."""
    src = os.path.join(STAGING_DIR, f"{name}__c{k}.jpg")
    if not os.path.exists(src):
        sys.exit(f"no candidate {k} for {name} (looked for {os.path.basename(src)})")
    shutil.copy2(src, os.path.join(STAGING_DIR, f"{name}.jpg"))
    print(f"  {name} -> candidate {k} is now the active pick", flush=True)
    # If this name has region thumbnails derived from it, rebuild them from the new pick.
    derive_thumbs(STAGING_DIR, {})
    build_preview(STAGING_DIR)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", help="limit to these names")
    ap.add_argument("--promote", action="store_true",
                    help="copy staged images into public/images/ (the live folder)")
    ap.add_argument("--pick", nargs=2, metavar=("NAME", "K"),
                    help="set candidate K as the active pick for NAME (e.g. --pick porto 2)")
    ap.add_argument("--no-open", action="store_true", help="don't auto-open the preview")
    args = ap.parse_args()

    if args.pick:
        pick(args.pick[0], args.pick[1])
        return

    if args.promote:
        promote(set(args.only) if args.only else None)
        return

    os.makedirs(STAGING_DIR, exist_ok=True)
    targets = [x for x in IMAGES if not args.only or x[0] in args.only]

    saved = {}
    for i, (name, size, prompt) in enumerate(targets, 1):
        w, h = SIZE_TO_WH.get(size, (1024, 1024))
        print(f"[{i}/{len(targets)}] generating {name} ({w}x{h}, {N_CANDIDATES} candidates) "
              f"on MiniMax image-01 ...", flush=True)
        try:
            imgs = generate(name, size, prompt, n=N_CANDIDATES)
        except Exception as e:
            print(f"  FAILED {name}: {e}", flush=True)
            continue
        # Clear any stale candidates from a previous run, then save each candidate.
        for old in os.listdir(STAGING_DIR):
            if old.startswith(f"{name}__c") and old.endswith(".jpg"):
                os.remove(os.path.join(STAGING_DIR, old))
        for k, im in enumerate(imgs, 1):
            im.save(os.path.join(STAGING_DIR, f"{name}__c{k}.jpg"), "JPEG", quality=82, optimize=True)
        # Candidate 1 is the default active pick ({name}.jpg). Use --pick to switch.
        imgs[0].save(os.path.join(STAGING_DIR, f"{name}.jpg"), "JPEG", quality=82, optimize=True)
        saved[name] = imgs[0]
        print(f"  staged {name}.jpg (+ {len(imgs)} candidates)", flush=True)

    derive_thumbs(STAGING_DIR, saved)
    preview = build_preview(STAGING_DIR)
    print(f"PREVIEW: {preview}", flush=True)
    if not args.no_open and sys.platform == "darwin":
        subprocess.run(["open", preview], check=False)
    print("Review the gallery. Promote keepers with: python3 scripts/generate_images.py --promote", flush=True)


if __name__ == "__main__":
    main()
