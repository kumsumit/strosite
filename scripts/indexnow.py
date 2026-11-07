"""Submit deployed sitemap URLs after verifying the public ownership key.

No submission without --submit; success acknowledges receipt, not indexing.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import argparse, json, re, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://stromule.com'
def main():
    parser = argparse.ArgumentParser(); parser.add_argument('--submit', action='store_true'); args = parser.parse_args()
    key = (ROOT / 'indexnow-key.txt').read_text().strip()
    if not re.fullmatch(r'[a-zA-Z0-9-]{8,128}', key): raise ValueError('Invalid IndexNow key')
    urls = [el.text for el in ET.parse(ROOT / '_site/sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    payload = {'host':'stromule.com', 'key':key, 'keyLocation':ORIGIN+'/indexnow-key.txt', 'urlList':urls}
    if not args.submit:
        print(f'IndexNow dry run: {len(urls)} canonical URLs; no network request.'); return
    with urlopen(ORIGIN+'/indexnow-key.txt', timeout=30) as response:
        if response.read().decode().strip() != key: raise ValueError('Deployed key does not match; aborting')
    request = Request('https://api.indexnow.org/indexnow', data=json.dumps(payload).encode(), headers={'Content-Type':'application/json; charset=utf-8'}, method='POST')
    with urlopen(request, timeout=30) as response:
        if response.status not in (200,202): raise RuntimeError(f'Unexpected status {response.status}')
        print(f'IndexNow received submission: HTTP {response.status}. Indexing is not guaranteed.')
if __name__ == '__main__': main()
