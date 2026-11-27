import json

with open('scripts/search_results.json', 'r', encoding='utf-8') as f1, open('scripts/clean_poses.json', 'r', encoding='utf-8') as f2:
    d1 = json.load(f1)
    d2 = json.load(f2)

combined = {}
for p in d1:
    combined[p] = {}
    for img in d1[p] + d2[p]:
        combined[p][img['id']] = img

for pony, imgs in combined.items():
    print(f"\n==================== {pony.upper()} ====================")
    sorted_imgs = sorted(imgs.values(), key=lambda x: x['score'], reverse=True)
    for img in sorted_imgs[:10]:
        t = img['tags']
        descriptive = [x for x in t if any(k in x for k in ['sit', 'stand', 'fly', 'hover', 'happy', 'peek', 'front', 'walk', 'run', 'smile', 'salut', 'grin', 'wink', 'trot', 'lying', 'head'])]
        has_clothes = any('clothes' in x or 'suit' in x or 'dress' in x or 'outfit' in x for x in t)
        print(f"ID {img['id']}: score={img['score']}, {img['width']}x{img['height']}, clothes={has_clothes}, tags={descriptive[:5]}")
