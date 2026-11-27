import os
import json
import urllib.request
from PIL import Image

os.makedirs('assets/poses', exist_ok=True)

targets = {
    'fluttershy-pose2': 1967918,  # Happy standing Fluttershy
    'applejack-pose2': 1973713,   # Sitting Applejack
}

for out_name, img_id in targets.items():
    raw_path = f'assets/poses/raw_{out_name}.png'
    final_path = f'assets/poses/{out_name}.png'
    api_url = f'https://derpibooru.org/api/v1/json/images/{img_id}'
    req = urllib.request.Request(api_url, headers={'User-Agent': 'MLPWallpaper/1.0'})
    with urllib.request.urlopen(req, timeout=15) as r:
        info = json.loads(r.read().decode())['image']
        img_url = info['representations'].get('large') or info['representations']['full']
        print(f"Downloading {out_name} (ID {img_id}) from {img_url} ...")
        img_req = urllib.request.Request(img_url, headers={'User-Agent': 'MLPWallpaper/1.0'})
        with urllib.request.urlopen(img_req, timeout=30) as ir:
            with open(raw_path, 'wb') as f:
                f.write(ir.read())

    # Process: verify alpha, crop bbox, max height 1000
    img = Image.open(raw_path).convert('RGBA')
    amin, amax = img.split()[-1].getextrema()
    if amin > 0:
        raise ValueError(f"{raw_path} is not transparent (alpha min={amin})")
    bbox = img.getbbox()
    cropped = img.crop(bbox)
    w, h = cropped.size
    if h > 1000 or w > 1400:
        scale = min(1000.0 / h, 1400.0 / w)
        cropped = cropped.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.Resampling.LANCZOS)
    cropped.save(final_path, 'PNG', optimize=True)
    os.remove(raw_path)
    print(f"Saved processed {final_path}: {cropped.size[0]}x{cropped.size[1]}")
