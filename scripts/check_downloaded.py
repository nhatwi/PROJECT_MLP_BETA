from PIL import Image
import os

poses_dir = 'assets/poses'
for f in sorted(os.listdir(poses_dir)):
    if f.endswith('.png'):
        p = os.path.join(poses_dir, f)
        img = Image.open(p)
        bbox = img.getbbox()
        has_alpha = img.mode == 'RGBA'
        # Check if alpha actually contains transparent pixels
        if has_alpha:
            alpha = img.split()[-1]
            extrema = alpha.getextrema() # (min_alpha, max_alpha)
        else:
            extrema = None
        print(f"{f:25}: size={img.size}, bbox={bbox}, alpha_range={extrema}")
