#!/usr/bin/env python3
"""
scripts/process_sprites.py
Verifies RGBA transparency, trims excess padding on character poses so the
bottom-most visible pixel sits flush at the bottom edge, and normalizes all
oversized PNGs (>1000px) across assets/ and assets/poses/.
"""

import os
from PIL import Image

MAX_HEIGHT = 1000
MAX_WIDTH = 1400
ASSETS_DIR = 'assets'
POSES_DIR = os.path.join(ASSETS_DIR, 'poses')


def verify_and_normalize_png(path, trim_flush=False):
    img = Image.open(path).convert('RGBA')
    alpha = img.split()[-1]
    amin, _ = alpha.getextrema()
    if amin > 0:
        raise ValueError(f"{path} lacks transparent pixels (alpha min={amin})")

    bbox = img.getbbox()
    if not bbox:
        raise ValueError(f"{path} appears completely empty/transparent!")

    changed = False
    out_img = img
    if trim_flush and bbox != (0, 0, img.width, img.height):
        out_img = img.crop(bbox)
        changed = True

    w, h = out_img.size
    if h > MAX_HEIGHT or w > MAX_WIDTH:
        scale = min(MAX_HEIGHT / float(h), MAX_WIDTH / float(w))
        nw = max(1, int(round(w * scale)))
        nh = max(1, int(round(h * scale)))
        out_img = out_img.resize((nw, nh), Image.Resampling.LANCZOS)
        changed = True

    if changed:
        out_img.save(path, 'PNG', optimize=True)
        print(f"Normalized: {path} ({w}x{h} -> {out_img.size[0]}x{out_img.size[1]})")
    else:
        print(f"Verified OK: {path} ({out_img.size[0]}x{out_img.size[1]})")
    return out_img.size


def main():
    os.makedirs(POSES_DIR, exist_ok=True)
    print("=" * 60)
    print("PROJECT_MLP: Verifying & Normalizing PNG Assets")
    print("=" * 60)

    count = 0
    # 1. Verify and trim-flush all pose sprites in assets/poses/
    for fname in sorted(os.listdir(POSES_DIR)):
        if fname.lower().endswith('.png'):
            verify_and_normalize_png(os.path.join(POSES_DIR, fname), trim_flush=True)
            count += 1

    # 2. Verify and size-normalize root PNGs in assets/ (preserve sticker/cm square padding)
    for fname in sorted(os.listdir(ASSETS_DIR)):
        fpath = os.path.join(ASSETS_DIR, fname)
        if os.path.isfile(fpath) and fname.lower().endswith('.png'):
            is_sticker_or_cm = fname.startswith('sticker-') or fname.startswith('cm-')
            verify_and_normalize_png(fpath, trim_flush=not is_sticker_or_cm)
            count += 1

    print(f"\nDone! Verified/normalized {count} PNG assets across assets/ and assets/poses/.")


if __name__ == '__main__':
    main()
