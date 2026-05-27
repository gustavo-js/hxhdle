#!/usr/bin/env python3
"""
Downloads character portrait images from the Hunter x Hunter Fandom wiki.
Saves images to public/images/characters/.
Outputs characters-skeleton.json with id, name, and image fields pre-filled.

Usage: python3 scripts/fetch-images.py
"""

import json
import os
import time
import urllib.request
import urllib.parse
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "public" / "images" / "characters"
WIKI_API = "https://hunterxhunter.fandom.com/api.php"

CHARACTERS = [
    "Gon Freecss", "Killua Zoldyck", "Kurapika", "Leorio Paradinight",
    "Hisoka Morow", "Illumi Zoldyck", "Isaac Netero", "Meruem",
    "Neferpitou", "Shaiapouf", "Menthuthuyoupi", "Chrollo Lucilfer",
    "Feitan Portor", "Machi Komacine", "Nobunaga Hazama", "Pakunoda",
    "Phinks Magcub", "Shalnark", "Kortopi", "Shizuku Murasaki",
    "Bonolenov Ndongo", "Uvogin", "Neon Nostrade", "Biscuit Krueger",
    "Wing", "Zushi", "Knuckle Bine", "Shoot McMahon",
    "Morel Mackernasey", "Knov", "Palm Siberia", "Ikalgo",
    "Meleoron", "Colt", "Cheetu", "Leol", "Welfin", "Bloster",
    "Rammot", "Zazan", "Kite", "Ging Freecss", "Pariston Hill",
    "Cheadle Yorkshire", "Botobai Gigante", "Ginta", "Cluck",
    "Piyon", "Sanbica Norton", "Mizaistom Nana", "Saccho Kobayakawa",
    "Kanzai", "Gel", "Lupe", "Silva Zoldyck", "Kikyo Zoldyck",
    "Milluki Zoldyck", "Alluka Zoldyck", "Zeno Zoldyck", "Mito Freecss",
    "Franken Nobunaga", "Razor", "Genthru", "Goreinu",
    "Tsezguerra", "Bisky",
]

def slug(name: str) -> str:
    return name.lower().replace(" ", "-").replace("'", "").replace(".", "")

def get_image_url(character_name: str) -> str | None:
    params = urllib.parse.urlencode({
        "action": "query",
        "titles": character_name,
        "prop": "pageimages",
        "format": "json",
        "pithumbsize": 400,
    })
    url = f"{WIKI_API}?{params}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "hxhdle-scraper/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            thumb = page.get("thumbnail", {})
            if thumb.get("source"):
                return thumb["source"]
    except Exception as e:
        print(f"  Error fetching {character_name}: {e}")
    return None

def download_image(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "hxhdle-scraper/1.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            dest.write_bytes(resp.read())
        return True
    except Exception as e:
        print(f"  Error downloading {url}: {e}")
        return False

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    skeleton = []

    for name in CHARACTERS:
        char_id = slug(name)
        dest = OUTPUT_DIR / f"{char_id}.webp"

        if dest.exists():
            print(f"  Skipping {name} (already downloaded)")
        else:
            print(f"Fetching {name}...")
            img_url = get_image_url(name)
            if img_url:
                success = download_image(img_url, dest)
                if success:
                    print(f"  Saved {dest.name}")
                time.sleep(0.5)
            else:
                print(f"  No image found for {name}")

        skeleton.append({
            "id": char_id,
            "name": name,
            "image": f"/images/characters/{char_id}.webp",
            "_fill_in": {
                "gender": "",
                "origin": "",
                "affiliation": [],
                "nenType": [],
                "status": "",
                "ageRange": "",
                "hunterLicense": False
            }
        })

    out = Path(__file__).parent.parent / "src" / "data" / "characters-skeleton.json"
    out.write_text(json.dumps(skeleton, indent=2, ensure_ascii=False))
    print(f"\nSkeleton written to {out}")
    print("Fill in _fill_in fields for each character, then replace characters.json.")

if __name__ == "__main__":
    main()
