import os
from PIL import Image

poses_dir = 'assets/poses'
for f in sorted(os.listdir(poses_dir)):
    if f.endswith('.png'):
        p = os.path.join(poses_dir, f)
        img = Image.open(p)
        w, h = img.size
        print(f"{f:22}: {w}x{h} (aspect ratio: {w/h:.3f})")
