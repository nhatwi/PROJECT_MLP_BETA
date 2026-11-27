import os
import json
import re
from PIL import Image, ImageDraw, ImageFont

# 1. Check all PNGs in assets/ and assets/poses/
print("=== Checking all PNGs in assets/ ===")
for root, dirs, files in os.walk("assets"):
    for f in sorted(files):
        if f.lower().endswith(".png"):
            p = os.path.join(root, f)
            img = Image.open(p)
            w, h = img.size
            mode = img.mode
            if mode == "RGBA":
                alpha_min, alpha_max = img.split()[-1].getextrema()
            else:
                alpha_min, alpha_max = (-1, -1)
            bbox = img.getbbox()
            bottom_gap = (h - bbox[3]) if bbox else h
            flag = []
            if mode != "RGBA": flag.append(f"MODE={mode}")
            if alpha_min > 0: flag.append(f"NO_TRANSP(min={alpha_min})")
            if h > 1000: flag.append(f"H>1000({h})")
            if bottom_gap > 5 and "poses" in root: flag.append(f"BOTTOM_GAP={bottom_gap}")
            print(f"{p:38} | {w:4}x{h:4} | {mode:4} | amin={alpha_min:3} | bgap={bottom_gap:3} | {' '.join(flag) or 'OK'}")

# 2. Extract MANE_6_CHARACTERS from app.js by parsing or regex/eval-like check
with open("app.js", "r", encoding="utf-8") as fp:
    js = fp.read()

# Find poses in app.js
char_blocks = re.findall(r"(\w+):\s*\{\s*id:\s*'(\w+)'.*?poses:\s*\[(.*?)\]\s*\}(?=\s*,|\s*\};)", js, re.S)
print(f"\nFound {len(char_blocks)} character blocks in app.js")

scratch_dir = r"C:\Users\nhatwi\.gemini\antigravity\brain\56458177-68fc-41a5-aac3-93e98425d6b4\scratch"
os.makedirs(scratch_dir, exist_ok=True)

# Render 3 sheets (2 characters per sheet = 6 poses per sheet) for high-res inspection
poses_data = []
for char_key, char_id, poses_str in char_blocks:
    pose_objs = re.findall(r"\{\s*id:\s*'([^']+)'.*?file:\s*'([^']+)'.*?leftEye:\s*\{([^}]+)\}.*?rightEye:\s*\{([^}]+)\}", poses_str, re.S)
    for pid, pfile, le_str, re_str in pose_objs:
        def parse_eye(s):
            d = {}
            for k in ["cx", "cy", "rx", "ry", "rot"]:
                m = re.search(rf"{k}:\s*([-\d.]+)", s)
                if m: d[k] = float(m.group(1))
            m_h = re.search(r"hidden:\s*(true|false)", s)
            d["hidden"] = (m_h.group(1) == "true") if m_h else False
            return d
        poses_data.append((char_id, pid, pfile, parse_eye(le_str), parse_eye(re_str)))

print(f"Parsed {len(poses_data)} poses from app.js")

cell_w, cell_h = 400, 420
cols = 3
for sheet_idx in range(3):
    chunk = poses_data[sheet_idx*6:(sheet_idx+1)*6]
    if not chunk: continue
    rows = 2
    sheet = Image.new("RGBA", (cols * cell_w, rows * cell_h), (240, 240, 245, 255))
    draw = ImageDraw.Draw(sheet)
    for idx, (cid, pid, pfile, le, reye) in enumerate(chunk):
        c = idx % cols
        r = idx // cols
        ox = c * cell_w
        oy = r * cell_h
        # Checkerboard hint or white bg box
        draw.rectangle([ox+5, oy+5, ox+cell_w-5, oy+cell_h-5], fill=(255, 255, 255, 255), outline=(180, 180, 180, 255))
        if os.path.exists(pfile):
            sp = Image.open(pfile).convert("RGBA")
            # Fit inside 360x360 box
            box_s = 350
            ratio = min(box_s / sp.width, box_s / sp.height)
            nw, nh = int(sp.width * ratio), int(sp.height * ratio)
            sp_r = sp.resize((nw, nh), Image.Resampling.LANCZOS)
            px = ox + (cell_w - nw) // 2
            py = oy + 35 + (box_s - nh) // 2
            sheet.alpha_composite(sp_r, (px, py))
            # Draw grid 10..90% subtly
            for p in range(10, 100, 10):
                gx = px + int(nw * p / 100)
                gy = py + int(nh * p / 100)
                draw.line([(gx, py), (gx, py+nh)], fill=(200, 200, 220, 120), width=1)
                draw.line([(px, gy), (px+nw, gy)], fill=(200, 200, 220, 120), width=1)
            # Draw left & right eye ellipses
            for label, eye, col in [("L", le, (255, 0, 85, 220)), ("R", reye, (0, 120, 255, 220))]:
                if eye.get("hidden"): continue
                ecx = px + (eye["cx"] / 100.0) * nw
                ecy = py + (eye["cy"] / 100.0) * nh
                erx = (eye["rx"] / 100.0) * nw
                ery = (eye["ry"] / 100.0) * nh
                draw.ellipse([ecx - erx, ecy - ery, ecx + erx, ecy + ery], outline=col, width=3)
                draw.line([(ecx - 6, ecy), (ecx + 6, ecy)], fill=col, width=2)
                draw.line([(ecx, ecy - 6), (ecx, ecy + 6)], fill=col, width=2)
        draw.text((ox + 12, oy + 10), f"{cid}-{pid} ({pfile})", fill=(20, 20, 40, 255))
    out_path = os.path.join(scratch_dir, f"poses_sheet_{sheet_idx+1}.png")
    sheet.save(out_path)
    print(f"Saved calibration sheet: {out_path}")
