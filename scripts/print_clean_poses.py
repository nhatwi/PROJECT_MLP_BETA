import json

with open('scripts/clean_poses.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for pony, imgs in data.items():
    print(f"=== {pony.upper()} ===")
    for img in imgs[:6]:
        print(f"  ID {img['id']}: score={img['score']}, {img['width']}x{img['height']}, tags={img['tags'][:4]}")
