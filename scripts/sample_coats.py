import os
from PIL import Image

# Sample pixels on forehead / nose bridge right next to eyes
samples = [
    ("pinkie-pose1.png", 55, 55),
    ("pinkie-pose2.png", 44, 38),
    ("pinkie-pose3.png", 48, 37),
    ("twilight-pose1.png", 50, 48),
    ("twilight-pose2.png", 39, 34),
    ("twilight-pose3.png", 51, 45),
    ("rainbow-pose1.png", 58, 52),
    ("rainbow-pose2.png", 66, 35),
    ("rainbow-pose3.png", 78, 30),
    ("fluttershy-pose1.png", 52, 62),
    ("fluttershy-pose2.png", 28, 32),
    ("fluttershy-pose3.png", 43, 33),
    ("rarity-pose1.png", 75, 54),
    ("rarity-pose2.png", 37, 30),
    ("rarity-pose3.png", 51, 32),
    ("applejack-pose1.png", 54, 60),
    ("applejack-pose2.png", 46, 36),
    ("applejack-pose3.png", 46, 46),
]

for fname, px_pct, py_pct in samples:
    p = os.path.join("assets/poses", fname)
    img = Image.open(p).convert("RGBA")
    x = int(img.width * px_pct / 100.0)
    y = int(img.height * py_pct / 100.0)
    r, g, b, a = img.getpixel((x, y))
    print(f"{fname:22} @ ({px_pct},{py_pct}): #{r:02X}{g:02X}{b:02X} (alpha={a})")
