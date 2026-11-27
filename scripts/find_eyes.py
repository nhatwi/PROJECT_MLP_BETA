import os
from PIL import Image

eye_colors = {
    'pinkie': (71, 146, 179),      # #4792B3
    'twilight': (102, 45, 145),    # #662D91
    'rainbow': (191, 24, 104),     # #BF1868
    'fluttershy': (57, 181, 74),   # #39B54A
    'rarity': (46, 49, 146),       # #2E3192
    'applejack': (74, 153, 61)     # #4A993D
}

def color_dist(c1, c2):
    return sum((a - b) ** 2 for a, b in zip(c1[:3], c2[:3])) ** 0.5

def find_eye_regions(img_path, target_color):
    img = Image.open(img_path).convert('RGBA')
    w, h = img.size
    pixels = img.load()
    
    matches = []
    # Search upper 70% of image (head region)
    for y in range(int(h * 0.1), int(h * 0.7)):
        for x in range(int(w * 0.1), int(w * 0.9)):
            r, g, b, a = pixels[x, y]
            if a > 150:
                d = color_dist((r, g, b), target_color)
                if d < 60: # close to iris color
                    matches.append((x / w * 100.0, y / h * 100.0))
                    
    if not matches:
        return None
        
    # Cluster matches into left and right eyes based on x-coordinate
    avg_x = sum(m[0] for m in matches) / len(matches)
    left_cluster = [m for m in matches if m[0] < avg_x - 3]
    right_cluster = [m for m in matches if m[0] > avg_x + 3]
    
    res = {}
    if left_cluster:
        lx = sum(m[0] for m in left_cluster) / len(left_cluster)
        ly = sum(m[1] for m in left_cluster) / len(left_cluster)
        res['left'] = (round(lx, 1), round(ly, 1), len(left_cluster))
    if right_cluster:
        rx = sum(m[0] for m in right_cluster) / len(right_cluster)
        ry = sum(m[1] for m in right_cluster) / len(right_cluster)
        res['right'] = (round(rx, 1), round(ry, 1), len(right_cluster))
    if not left_cluster and not right_cluster:
        all_x = sum(m[0] for m in matches) / len(matches)
        all_y = sum(m[1] for m in matches) / len(matches)
        res['single'] = (round(all_x, 1), round(all_y, 1), len(matches))
        
    return res

poses_dir = 'assets/poses'
for f in sorted(os.listdir(poses_dir)):
    if f.endswith('.png'):
        p = os.path.join(poses_dir, f)
        char = f.split('-')[0]
        col = eye_colors.get(char)
        if col:
            res = find_eye_regions(p, col)
            print(f"{f:22}: eye scan result = {res}")
