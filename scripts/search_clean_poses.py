import urllib.request
import urllib.parse
import json

ponies = {
    'pinkie': 'pinkie pie',
    'twilight': 'twilight sparkle',
    'rainbow': 'rainbow dash',
    'fluttershy': 'fluttershy',
    'rarity': 'rarity',
    'applejack': 'applejack'
}

def search_clean():
    clean_results = {}
    for pony_id, name in ponies.items():
        # High quality show vectors without clothes/accessories
        q = f'safe,transparent background,vector,solo,{name},-clothes,-crossover,-human,-equestria girls,-meme,-screencap,-text,-weapon'
        url = 'https://derpibooru.org/api/v1/json/search/images?q=' + urllib.parse.quote(q) + '&sf=score&per_page=12'
        req = urllib.request.Request(url, headers={'User-Agent': 'MLPWallpaper/1.0'})
        try:
            with urllib.request.urlopen(req, timeout=10) as r:
                data = json.loads(r.read().decode())
                clean_results[pony_id] = []
                for img in data.get('images', []):
                    if img.get('format') == 'png':
                        clean_results[pony_id].append({
                            'id': img['id'],
                            'score': img['score'],
                            'width': img['width'],
                            'height': img['height'],
                            'url': img['representations']['full'],
                            'tags': [t for t in img['tags'] if any(k in t for k in ['sit', 'stand', 'fly', 'hover', 'happy', 'peek', 'front', 'walk', 'run', 'smile'])]
                        })
                print(f"{pony_id}: found {len(clean_results[pony_id])} clean vector options")
        except Exception as e:
            print(f"Error for {pony_id}: {e}")
            
    with open('scripts/clean_poses.json', 'w', encoding='utf-8') as f:
        json.dump(clean_results, f, indent=2)

if __name__ == '__main__':
    search_clean()
