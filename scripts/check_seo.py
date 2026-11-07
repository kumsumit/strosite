"""Validate crawl discovery and canonical consistency before publishing."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://stromule.com'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

urls = [node.text for node in ET.parse(ROOT / 'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
assert urls and len(urls) == len(set(urls)), 'Empty or duplicate sitemap URLs'
robots = (ROOT / 'robots.txt').read_text()
assert 'User-agent: *' in robots and 'Allow: /' in robots
assert f'Sitemap: {ORIGIN}/sitemap.xml' in robots
assert 'Disallow: /' not in robots
import re
for url in urls:
    parsed = urlsplit(url)
    assert f'{parsed.scheme}://{parsed.netloc}' == ORIGIN and not parsed.fragment
    path = ROOT / (parsed.path.lstrip('/') or 'index.html')
    text = path.read_text()
    page = Page(text)
    canonical = [a['href'] for t, a in page.tags if t == 'link' and a.get('rel') == 'canonical']
    assert canonical == [url], f'{path.name}: incorrect canonical'
    assert re.search(r'<title>[^<]+</title>', text)
    assert any(t == 'meta' and a.get('name') == 'description' and a.get('content') for t, a in page.tags)
    assert sum(t == 'h1' for t, _ in page.tags) == 1, f'{path.name}: expected one h1'
    assert not any(t == 'meta' and a.get('name') == 'robots' and 'noindex' in a.get('content', '') for t, a in page.tags)
    schemas = re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S)
    assert schemas, f'{path.name}: missing structured data'
    for schema in schemas:
        json.loads(schema)
    for tag, attrs in page.tags:
        target = attrs.get('href') if tag in ('a', 'link') else attrs.get('src')
        if not target:
            continue
        dest = urlsplit(target)
        if dest.scheme or dest.netloc:
            continue
        local = ROOT / unquote(dest.path.lstrip('/')) if dest.path else path
        if local.is_dir():
            local /= 'index.html'
        assert local.exists(), f'{path.name}: missing {target}'
        if dest.fragment and local.suffix == '.html':
            ids = {a.get('id') for _, a in Page(local.read_text()).tags}
            assert unquote(dest.fragment) in ids, f'{path.name}: missing anchor {target}'
        assert dest.path != 'index.html', f'{path.name}: link to canonical / instead'
print(f'SEO checks passed for {len(urls)} sitemap pages (metadata, schema, crawl rules, local links and anchors).')
