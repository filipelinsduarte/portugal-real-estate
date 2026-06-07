#!/usr/bin/env python3
"""Build a side-by-side comparison gallery of gpt-image-1 (current) vs gpt-image-2 (new)."""
import os
from html import escape

STAGING = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "image-staging"))

# (label, left_file, left_caption, right_file, right_caption)
PAIRS = [
    ("Lisbon (hero wide)", "lisbon.jpg", "gpt-image-1 · warm 'golden hour' style",
     "cmp-lisbon-v2.jpg", "gpt-image-2 · neutral daylight"),
    ("Algarve (hero wide)", "algarve.jpg", "gpt-image-1 · warm 'golden hour' style",
     "cmp-algarve-v2.jpg", "gpt-image-2 · neutral daylight"),
    ("Chiado apartment (listing)", "listing-chiado-lisbon.jpg", "gpt-image-1 · warm style",
     "cmp-chiado-v2.jpg", "gpt-image-2 · neutral daylight"),
    ("Aveiro (your exact prompt)", "aveiro.jpg", "gpt-image-1 · your prompt verbatim",
     "cmp-aveiro-v2.jpg", "gpt-image-2 · your prompt verbatim"),
]


def col(file, caption):
    if not os.path.exists(os.path.join(STAGING, file)):
        return f'<div class="col"><div class="ph">missing: {escape(file)}</div></div>'
    return f"""<div class="col">
      <a href="{file}" target="_blank"><img src="{file}" loading="lazy"></a>
      <p>{escape(caption)}</p>
    </div>"""


rows = ""
for label, lf, lc, rf, rc in PAIRS:
    rows += f"""<section>
      <h2>{escape(label)}</h2>
      <div class="pair">{col(lf, lc)}{col(rf, rc)}</div>
    </section>"""

html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Model & lighting comparison</title>
<style>
  body {{ font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; margin:0; background:#faf8f4; color:#1a1a1a; }}
  header {{ padding:26px 32px; border-bottom:1px solid #ddd8d0; background:#fff; }}
  header h1 {{ margin:0 0 4px; font-size:19px; }}
  header p {{ margin:0; color:#8a8a8a; font-size:13px; }}
  main {{ max-width:1280px; margin:0 auto; padding:8px 32px 64px; }}
  section {{ margin-top:34px; }}
  h2 {{ font-size:13px; text-transform:uppercase; letter-spacing:1.4px; color:#8a8a8a; margin:0 0 12px; }}
  .pair {{ display:grid; grid-template-columns:1fr 1fr; gap:18px; }}
  .col {{ background:#fff; border:1px solid #ddd8d0; }}
  .col img {{ width:100%; height:auto; display:block; background:#e8e2d9; }}
  .col p {{ margin:0; padding:10px 14px; font-size:12px; color:#555; }}
  .col:last-child p {{ color:#c2622a; font-weight:600; }}
  .ph {{ padding:60px 14px; text-align:center; color:#aaa; font-size:13px; }}
</style></head><body>
<header><h1>Lighting & model comparison</h1>
<p>Left = current (gpt-image-1, my warm style). Right = gpt-image-2 with neutral daylight. Click any image for full size.</p></header>
<main>{rows}</main></body></html>"""

path = os.path.join(STAGING, "comparison.html")
with open(path, "w") as f:
    f.write(html)
print("COMPARISON:", path)
