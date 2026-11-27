import os
import urllib.request
import json
from PIL import Image

os.makedirs('assets/poses', exist_ok=True)

# Selected candidate Derpibooru IDs for clean, iconic, show-style transparent vector poses
targets = {
    'twilight_pose2': 2053956,  # Sitting Twilight
    'twilight_pose3': 751293,   # Flying/Alicorn Twilight
    'rainbow_pose2': 2103685,   # Sitting Rainbow Dash
    'rainbow_pose3': 400078,    # Hovering/Flying Rainbow Dash
    'fluttershy_pose3': 1973656, # Sitting Fluttershy
    'rarity_pose2': 1078149,    # Sitting Rarity
    'rarity_pose3': 1941637,    # Happy/Dramatic Rarity
    'applejack_pose3': 650893,  # Waving/Smiling Applejack
    'pinkie_pose2': 342097,     # Sitting Pinkie
    'pinkie_pose3': 2171665     # Dynamic Party Pinkie
}

def download_candidates():
    for name, img_id in targets.items():
        out_path = f'assets/poses/raw_{name}.png'
        if os.path.exists(out_path):
            print(f"{out_path} already exists, skipping download")
            continue
        url = f'https://derpibooru.org/api/v1/json/images/{img_id}'
        req = urllib.request.Request(url, headers={'User-Agent': 'MLPWallpaper/1.0'})
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                info = json.loads(r.read().decode())['image']
                # Prefer 'large' (usually 1024-1280px) to keep download fast and clean, or 'full'
                img_url = info['representations'].get('large') or info['representations']['full']
                print(f"Downloading {name} (ID {img_id}) from {img_url} ...")
                img_req = urllib.request.Request(img_url, headers={'User-Agent': 'MLPWallpaper/1.0'})
                with urllib.request.urlopen(img_req, timeout=20) as img_r:
                    with open(out_path, 'wb') as f:
                        f.write(img_r.read())
                print(f"Saved {out_path}")
        except Exception as e:
            print(f"Error downloading {name}: {e}")

if __name__ == '__main__':
    download_candidates()
