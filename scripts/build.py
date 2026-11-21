"""Build only public website files; discover canonical HTML routes automatically."""
from pathlib import Path
from html.parser import HTMLParser
import json, shutil, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_site'
ORIGIN = 'https://stromule.com'
class Metadata(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.canonical = []; self.noindex = False; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical.append(a['href'])
        if tag == 'meta' and a.get('name') == 'robots': self.noindex |= 'noindex' in a.get('content', '')

def build():
    if OUT.exists(): shutil.rmtree(OUT)
    OUT.mkdir()
    urls = []
    for source in sorted(ROOT.rglob('*.html')):
        relative = source.relative_to(ROOT)
        if any(part.startswith('.') or part in ('_site', 'scripts', 'node_modules') for part in relative.parts): continue
        meta = Metadata(source.read_text(encoding='utf-8'))
        if source.name != '404.html' and not meta.noindex:
            route = '/' + relative.as_posix()
            if route.endswith('index.html'): route = route[:-10]
            expected = ORIGIN + route
            if meta.canonical != [expected]: raise ValueError(f'{relative}: expected canonical {expected}')
            urls.append(expected)
        dest = OUT / relative; dest.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(source, dest)
    # Public runtime assets only. Research documents and automation stay private to the repository.
    for pattern in ('*.css', '*.js'):
        for source in ROOT.glob(pattern): shutil.copy2(source, OUT / source.name)
    for name in ('assets',): shutil.copytree(ROOT / name, OUT / name)
    for name in ('CNAME', '.nojekyll', 'favicon.ico', 'robots.txt', 'llms.txt', 'indexnow-key.txt'):
        shutil.copy2(ROOT / name, OUT / name)
    # CMS at /admin/: page (copied above as HTML), config and the pinned Sveltia CMS bundle.
    cms = ROOT / 'node_modules' / '@sveltia' / 'cms' / 'dist' / 'sveltia-cms.js'
    if not cms.exists(): raise SystemExit('Sveltia CMS bundle missing: run npm ci first')
    shutil.copy2(cms, OUT / 'admin' / 'sveltia-cms.js'); shutil.copy2(ROOT / 'admin' / 'config.yml', OUT / 'admin' / 'config.yml')
    if (ROOT / 'blog' / 'feed.xml').exists():
        (OUT / 'blog').mkdir(exist_ok=True); shutil.copy2(ROOT / 'blog' / 'feed.xml', OUT / 'blog' / 'feed.xml')
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    tree = ET.Element('{http://www.sitemaps.org/schemas/sitemap/0.9}urlset')
    for url in urls:
        entry = ET.SubElement(tree, 'url'); ET.SubElement(entry, 'loc').text = url
    ET.indent(tree)
    content = ET.tostring(tree, encoding='unicode', xml_declaration=True) + '\n'
    (OUT / 'sitemap.xml').write_text(content, encoding='utf-8')
    (ROOT / 'sitemap.xml').write_text(content, encoding='utf-8')
    print(f'Built {len(urls)} indexable pages and a noindex 404 into {OUT}')
if __name__ == '__main__': build()
