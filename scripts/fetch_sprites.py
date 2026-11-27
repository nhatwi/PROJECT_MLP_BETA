import urllib.request
import urllib.parse
import json
import os
import sys

ponies = {
    'twilight': 'twilight sparkle',
    'rainbow': 'rainbow dash',
    'rarity': 'rarity',
    'applejack': 'applejack',
    'fluttershy': 'fluttershy',
    'pinkie': 'pinkie pie'
}

def search_ponies():
    results = {}
    for pony_id, pony_name in ponies.items():
        q = urllib.parse.quote(f'safe,transparent background,vector,solo,{pony_name},-equestria girls,-human,-text,-cropped')
        url = f'https://derpibooru.org/api/v1/json/search/images?q={q}&sf=score&per_page=10'
        req = urllib.request.Request(url, headers={'User-Agent': 'MLPWallpaper/1.0'})
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                data = json.loads(r.read().decode())
                imgs = []
                for img in data.get('images', []):
                    if img.get('format') == 'png':
                        imgs.append({
                            'id': img.get('id'),
                            'score': img.get('score'),
                            'width': img.get('width'),
                            'height': img.get('height'),
                            'url': img.get('representations', {}).get('full') or img.get('view_url'),
                            'tags': img.get('tags', [])
                        })
                results[pony_id] = imgs
                print(f"Found {len(imgs)} candidate sprites for {pony_id}")
        except Exception as e:
            print(f"Error fetching {pony_id}: {e}")
    return results

if __name__ == '__main__':
    res = search_ponies()
    with open('scripts/search_results.json', 'w', encoding='utf-8') as f:
        json.dump(res, f, indent=2)
    print("Saved search_results.json")
