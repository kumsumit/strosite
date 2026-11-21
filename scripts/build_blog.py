"""Build the blog from content/blog/*.md into blog/ (generated, gitignored).

Posts are written in the CMS at /admin/ (Sveltia CMS) or by hand. Only posts that are
not drafts and whose `date` has passed are published, so a post can be scheduled and the
daily build publishes it. A post that fails `lint()` is skipped with a warning (or fails the
build when BLOG_STRICT=1, as in pull-request validation) so one bad post never takes the
site down. Posts marked `ai: true` also get strict honesty checks.

Usage:
  python scripts/build_blog.py            build blog/ and update index.html
  python scripts/build_blog.py --lint F   lint one post file, print JSON, exit 1 on errors
"""
from __future__ import annotations

import html
import json
import math
import re
import os
import shutil
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path

import markdown
import yaml
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / 'content' / 'blog'
OUT = ROOT / 'blog'
ORIGIN = 'https://stromule.com'
PAGE_SIZE = 12
FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Plus+Jakarta+Sans:wght@600;700;800&amp;display=swap'

CATEGORIES = {
    'Billing & invoicing': ('billing', 'Billing and invoicing guides for small businesses: bills, quotations, returns and getting paid on time.'),
    'Inventory & stock': ('inventory', 'Inventory and stock management guides: counting stock, reorder levels, wastage and purchase planning.'),
    'Customer credit': ('customer-credit', 'Guides to customer credit and ledgers: tracking what customers owe, reminders and healthy credit limits.'),
    'Running a shop': ('running-a-shop', 'Day-to-day operations for shop owners: staff, opening routines, suppliers and keeping records straight.'),
    'Growth': ('growth', 'Practical growth guides for small businesses: margins, repeat customers, pricing and planning.'),
    'Technology': ('technology', 'Plain-language guides to business software, spreadsheets, offline tools and moving records safely.'),
}
REGIONS = {'global', 'IN', 'GB', 'US', 'CA', 'AU', 'AE', 'SG'}

# --- Honesty and quality gate -------------------------------------------------
HEDGES = ('in development', 'being built', 'building', 'being designed', 'is designed', 'vision',
          'not yet available', 'not available', 'intended', 'aims to', 'plans to', 'is working on')
BANNED = ('sign up', 'signup', 'free trial', 'download stromule', 'available now', 'now available',
          'buy now', 'pricing plan', 'guaranteed', 'guarantee ', '#1 ', 'number one software',
          'best software', 'as an ai', 'i am an ai', 'language model')
TAX_WORDS = re.compile(r'\b(gst|vat|tax|tds|tcs|cess|duty|penalty|interest rate|late fee)\b', re.I)
PERCENT = re.compile(r'\b\d+(?:\.\d+)?\s?%')
LINK = re.compile(r'\]\(([^)\s]+)')
IMAGE = re.compile(r'!\[[^\]]*\]\(([^)\s]+)')
RAW_URL = re.compile(r'https?://[^\s)>\]]+')


def split_front_matter(text: str) -> tuple[dict, str]:
    if not text.startswith('---'):
        raise ValueError('missing front matter (file must start with ---)')
    _, fm, body = text.split('---', 2)
    data = yaml.safe_load(fm) or {}
    if not isinstance(data, dict):
        raise ValueError('front matter must be a mapping')
    return data, body.strip()


def parse_date(value) -> datetime:
    if isinstance(value, datetime):
        dt = value
    else:
        dt = datetime.fromisoformat(str(value))
    if dt.tzinfo is None:
        raise ValueError('date must include a time zone, e.g. 2026-11-21T09:00:00+05:30')
    return dt


def sentences(text: str) -> list[str]:
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+|\n+', text) if s.strip()]


def local_file(src: str) -> Path | None:
    """Map a site path such as /assets/blog/x.png to the repository file."""
    if src.startswith(ORIGIN):
        src = src[len(ORIGIN):]
    if not src.startswith('/'):
        return None
    return ROOT / src.lstrip('/').split('?')[0].split('#')[0]


def lint(path: Path, existing_titles: set[str] | None = None) -> list[str]:
    errors: list[str] = []
    try:
        meta, body = split_front_matter(path.read_text(encoding='utf-8'))
    except Exception as exc:  # report every parse problem as a lint error
        return [f'front matter: {exc}']
    slug = path.stem.lower()
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug) or len(slug) > 80:
        errors.append('file name must be a lowercase-hyphen slug under 80 characters')
    for key in ('title', 'description', 'date', 'category', 'region'):
        if not meta.get(key):
            errors.append(f'missing front matter field: {key}')
    if errors:
        return errors
    ai = bool(meta.get('ai', False))
    title, desc = str(meta['title']).strip(), str(meta['description']).strip()
    if not 20 <= len(title) <= 70:
        errors.append(f'title must be 20-70 characters (is {len(title)})')
    if not 110 <= len(desc) <= 170:
        errors.append(f'description must be 110-170 characters (is {len(desc)})')
    if existing_titles and title.lower() in existing_titles:
        errors.append('title duplicates an existing post')
    try:
        parse_date(meta['date'])
    except Exception as exc:
        errors.append(f'date: {exc}')
    if meta.get('updated'):
        try:
            parse_date(meta['updated'])
        except Exception as exc:
            errors.append(f'updated: {exc}')
    if meta['category'] not in CATEGORIES:
        errors.append(f'category must be one of: {", ".join(CATEGORIES)}')
    if meta['region'] not in REGIONS:
        errors.append(f'region must be one of: {", ".join(sorted(REGIONS))}')
    faq = meta.get('faq') or []
    if not isinstance(faq, list) or any(not isinstance(i, dict) or not str(i.get('q', '')).strip() or not str(i.get('a', '')).strip() for i in faq):
        errors.append('each faq item needs a question (q) and an answer (a)')
        faq = []
    elif ai and not 3 <= len(faq) <= 6:
        errors.append('faq must list 3-6 items')
    elif ai and any(not str(i['q']).strip().endswith('?') for i in faq):
        errors.append('each faq question must end with ?')
    words = len(re.findall(r"\b[\w'’-]+\b", body))
    low, high = (700, 2600) if ai else (150, 6000)
    if not low <= words <= high:
        errors.append(f'body must be {low}-{high} words (is {words})')
    if re.search(r'^#\s', body, re.M):
        errors.append('body must not contain an H1 (# ...); the title is the H1')
    if ai and len(re.findall(r'^##\s', body, re.M)) < 3:
        errors.append('body needs at least 3 H2 sections (## ...)')
    # Images must be uploaded to the site (the CMS does this) so the build can size them.
    images = IMAGE.findall(body) + ([str(meta['image'])] if meta.get('image') else [])
    for src in images:
        file = local_file(src)
        if file is None:
            errors.append(f'image must be uploaded to the site, not linked from elsewhere: {src}')
        elif not file.is_file():
            errors.append(f'image not found: {src}')
    if meta.get('image') and not str(meta.get('image_alt', '')).strip():
        errors.append('cover image needs a short description (image_alt) for accessibility and SEO')
    if not ai:
        return errors
    # Honesty gate for AI-written posts.
    for target in LINK.findall(body) + RAW_URL.findall(body):
        if not (target.startswith('/') or target.startswith('#') or target.startswith(ORIGIN)):
            errors.append(f'external link not allowed: {target}')
    full_text = ' '.join([title, desc, body] + [f"{i.get('q', '')} {i.get('a', '')}" for i in faq])
    lower = full_text.lower()
    for phrase in BANNED:
        if phrase in lower:
            errors.append(f'banned phrase: "{phrase.strip()}"')
    for sentence in sentences(full_text):
        low_s = sentence.lower()
        if 'stromule' in low_s and not any(h in low_s for h in HEDGES):
            errors.append(f'unhedged product claim: "{sentence[:120]}"')
        if TAX_WORDS.search(sentence) and PERCENT.search(sentence):
            errors.append(f'specific tax/penalty rate (may go stale or be wrong): "{sentence[:120]}"')
    return errors


# --- Model -------------------------------------------------------------------
@dataclass
class Post:
    slug: str
    title: str
    description: str
    date: datetime
    updated: datetime
    category: str
    region: str
    author: str
    ai: bool
    tags: list[str]
    faq: list[dict]
    html: str
    toc: list[tuple[str, str]]
    words: int
    cover: str | None = None
    cover_alt: str = ''
    cover_size: tuple[int, int] = (1200, 630)
    related: list['Post'] = field(default_factory=list)

    @property
    def url(self) -> str:
        return f'/blog/{self.slug}/'

    @property
    def minutes(self) -> int:
        return max(1, math.ceil(self.words / 200))

    @property
    def cat_slug(self) -> str:
        return CATEGORIES[self.category][0]


def render_markdown(body: str) -> tuple[str, list[tuple[str, str]]]:
    md = markdown.Markdown(extensions=['toc', 'tables', 'sane_lists', 'smarty'], extension_configs={'toc': {'toc_depth': '2-3'}})
    out = md.convert(body)
    out = out.replace('<table>', '<div class="table-wrap"><table>').replace('</table>', '</table></div>')
    out = re.sub(r'<img ([^>]*?)\s*/?>', size_image, out)
    out = re.sub(r'<p>(<img [^>]+>)</p>', r'<figure class="post-figure">\1</figure>', out)
    toc = [(t['id'], html.unescape(t['name'])) for t in md.toc_tokens]
    return out, toc


def image_size(src: str) -> tuple[int, int] | None:
    file = local_file(src)
    if file is None or not file.is_file():
        return None
    with Image.open(file) as img:
        return img.size


def size_image(match: re.Match) -> str:
    attrs = match.group(1)
    src = re.search(r'src="([^"]+)"', attrs)
    size = image_size(html.unescape(src.group(1))) if src else None
    if size and 'width=' not in attrs:
        attrs += f' width="{size[0]}" height="{size[1]}"'
    return f'<img {attrs} loading="lazy" decoding="async">'


def load_posts(now: datetime) -> list[Post]:
    posts = []
    strict = os.environ.get('BLOG_STRICT') == '1'
    for path in sorted(CONTENT.glob('*.md')):
        try:
            meta, body = split_front_matter(path.read_text(encoding='utf-8'))
        except Exception:
            meta, body = {}, ''
        if meta.get('draft'):
            continue  # saved in the CMS, not published
        errors = lint(path)
        if errors:
            message = f'{path.relative_to(ROOT)} was not published because it failed checks:\n  - ' + '\n  - '.join(errors)
            if strict:
                raise SystemExit(message)
            print(f'WARNING: {message}', file=sys.stderr)
            continue
        date = parse_date(meta['date'])
        if date > now:
            continue  # scheduled for later
        content, toc = render_markdown(body)
        cover = str(meta['image']) if meta.get('image') else None
        posts.append(Post(
            slug=path.stem.lower(), title=str(meta['title']).strip(), description=str(meta['description']).strip(),
            date=date, updated=parse_date(meta.get('updated') or meta['date']), category=meta['category'],
            region=meta['region'], author=str(meta.get('author') or 'Stromule Editorial'), ai=bool(meta.get('ai', False)),
            tags=[str(t) for t in (meta.get('tags') or [])], faq=meta.get('faq') or [], html=content, toc=toc,
            words=len(re.findall(r"\b[\w'’-]+\b", body)),
            cover=cover, cover_alt=str(meta.get('image_alt') or '').strip(),
            cover_size=(image_size(cover) or (1200, 630)) if cover else (1200, 630),
        ))
    posts.sort(key=lambda p: p.date, reverse=True)
    for post in posts:
        same = [p for p in posts if p is not post and p.category == post.category]
        other = [p for p in posts if p is not post and p.category != post.category]
        post.related = (same + other)[:3]
    return posts


# --- Templates ---------------------------------------------------------------
e = html.escape


def fmt_date(d: datetime) -> str:
    return f'{d.day} {d:%B %Y}'


def head(title: str, desc: str, path: str, og_type: str = 'website', schema: list[dict] | None = None, extra: str = '',
         image: tuple[str, int, int, str] | None = None) -> str:
    url = ORIGIN + path
    img_url, img_w, img_h, img_alt = image or (f'{ORIGIN}/assets/social.png', 1200, 630, 'Stromule — Technology that feels useful in real life.')
    graph = json.dumps({'@context': 'https://schema.org', '@graph': schema or []}, ensure_ascii=False)
    return f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#f6f4ee"><link rel="canonical" href="{url}">
<meta property="og:type" content="{og_type}"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{img_url}"><meta property="og:image:alt" content="{e(img_alt)}"><meta property="og:image:width" content="{img_w}"><meta property="og:image:height" content="{img_h}"><meta property="og:site_name" content="Stromule"><meta property="og:locale" content="en_US">{extra}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(title)}"><meta name="twitter:description" content="{e(desc)}"><meta name="twitter:image" content="{img_url}">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="Stromule Blog" href="{ORIGIN}/blog/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="{FONTS}" rel="stylesheet">
<link rel="stylesheet" href="/site.css"><link rel="stylesheet" href="/blog.css"><script src="/site.js" defer></script><script src="/region.js" defer></script>
<script type="application/ld+json">{graph}</script>
</head><body class="legal-page blog-page"><a class="skip" href="#main">Skip to content</a>
<header class="header"><div class="nav wrap"><a class="brand" href="/" aria-label="Stromule home"><img src="/assets/logo-96.png" width="34" height="34" alt="Stromule logo">stromule</a><button class="menu-toggle" aria-expanded="false" aria-controls="navigation">Menu</button><nav id="navigation" aria-label="Main navigation"><a href="/#overview">Overview</a><a href="/#operations">Capabilities</a><a href="/#copilot">Copilot</a><a href="/#offline">Offline</a><a href="/#ecosystem">Pangeabuy</a><a href="/blog/" aria-current="page">Blog</a><a href="/#faq">FAQ</a></nav><a class="btn small green" href="/#start">Getting started <span aria-hidden="true">↗</span></a></div></header>
'''


FOOTER = '''<footer class="wrap"><div class="footer-main"><div class="footer-brand"><a class="brand" href="/"><img src="/assets/logo-96.png" width="34" height="34" alt="Stromule logo">stromule</a><p>An intelligent operating foundation for everyday businesses.</p><p>A product of <strong>Kumpali Private Limited.</strong><br>Technology that feels useful in real life.</p></div><div class="footer-col"><h3>PRODUCT</h3><a href="/#operations">Connected capabilities</a><a href="/#copilot">Business Copilot</a><a href="/#offline">Offline direction</a><a href="/#ecosystem">Pangeabuy commerce</a></div><div class="footer-col"><h3>BLOG</h3>{cats}<a href="/blog/feed.xml">RSS feed</a></div><div class="footer-col"><h3>COMPANY &amp; TRUST</h3><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms &amp; Conditions</a></div></div><div class="footer-bottom"><span>© <span id="year">2026</span> Kumpali Private Limited. All rights reserved.</span><a href="#main">Back to top ↑</a></div></footer>
</body></html>
'''


def footer(posts: list[Post]) -> str:
    used = [c for c in CATEGORIES if any(p.category == c for p in posts)]
    return FOOTER.replace('{cats}', ''.join(f'<a href="/blog/category/{CATEGORIES[c][0]}/">{e(c)}</a>' for c in used))


def card(p: Post, heading: str = 'h3') -> str:
    return (f'<li class="post-card" data-region="{p.region}"><a class="post-card-link" href="{p.url}">'
            f'<span class="post-card-cat">{e(p.category)}</span><{heading}>{e(p.title)}</{heading}>'
            f'<p>{e(p.description)}</p><span class="post-card-meta"><time datetime="{p.date.isoformat()}">{fmt_date(p.date)}</time> · {p.minutes} min read</span></a></li>')


def category_bar(posts: list[Post], active: str | None) -> str:
    all_current = ' aria-current="page"' if active is None else ''
    items = [f'<a href="/blog/"{all_current}>All <span>{len(posts)}</span></a>']
    for name, (slug, _) in CATEGORIES.items():
        count = sum(p.category == name for p in posts)
        if count:
            current = ' aria-current="page"' if active == name else ''
            items.append(f'<a href="/blog/category/{slug}/"{current}>{e(name)} <span>{count}</span></a>')
    return f'<nav class="blog-cats" aria-label="Blog categories">{"".join(items)}</nav>'


def pagination(base: str, page: int, pages: int) -> str:
    if pages <= 1:
        return ''
    def href(n: int) -> str:
        return base if n == 1 else f'{base}page/{n}/'
    links = []
    if page > 1:
        links.append(f'<a href="{href(page - 1)}" rel="prev">← Newer</a>')
    for n in range(1, pages + 1):
        links.append(f'<span aria-current="page">{n}</span>' if n == page else f'<a href="{href(n)}">{n}</a>')
    if page < pages:
        links.append(f'<a href="{href(page + 1)}" rel="next">Older →</a>')
    return f'<nav class="blog-pagination" aria-label="Blog pages">{"".join(links)}</nav>'


def breadcrumb_schema(items: list[tuple[str, str]]) -> dict:
    return {'@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i + 1, 'name': name, 'item': ORIGIN + path} for i, (name, path) in enumerate(items)]}


def write(path: str, content: str) -> None:
    dest = OUT / path.strip('/').removeprefix('blog').strip('/') / 'index.html'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(content, encoding='utf-8')


def listing_page(posts: list[Post], all_posts: list[Post], *, base: str, page: int, pages: int, title: str, h1: str,
                 lead: str, desc: str, active: str | None, crumbs: list[tuple[str, str]]) -> str:
    path = base if page == 1 else f'{base}page/{page}/'
    page_title = title if page == 1 else f'{title} — Page {page}'
    page_desc = desc if page == 1 else f'{desc} Page {page}.'
    start = (page - 1) * PAGE_SIZE
    chunk = posts[start:start + PAGE_SIZE]
    featured = ''
    if page == 1 and active is None and chunk:
        f = chunk[0]
        chunk = chunk[1:]
        featured = (f'<article class="post-featured" data-region="{f.region}"><a href="{f.url}"><span class="post-card-cat">Latest · {e(f.category)}</span>'
                    f'<h2>{e(f.title)}</h2><p>{e(f.description)}</p><span class="post-card-meta"><time datetime="{f.date.isoformat()}">{fmt_date(f.date)}</time> · {f.minutes} min read'
                    f'</span><span class="post-featured-cta">Read the guide <span aria-hidden="true">→</span></span></a></article>')
    schema = [
        {'@type': 'CollectionPage', '@id': ORIGIN + path + '#page', 'url': ORIGIN + path, 'name': page_title, 'description': page_desc,
         'isPartOf': {'@id': f'{ORIGIN}/#website'}, 'inLanguage': 'en'},
        breadcrumb_schema(crumbs),
    ]
    if active is None and page == 1:
        schema.append({'@type': 'Blog', '@id': f'{ORIGIN}/blog/#blog', 'name': 'Stromule Blog', 'url': f'{ORIGIN}/blog/',
                       'publisher': {'@id': f'{ORIGIN}/#organization'}, 'inLanguage': 'en'})
    body = (f'<main id="main"><section class="blog-hero"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb">'
            + ' <span aria-hidden="true">/</span> '.join(f'<a href="{p}">{e(n)}</a>' for n, p in crumbs[:-1])
            + f'</nav><h1>{e(h1)}</h1><p>{e(lead)}</p>{category_bar(all_posts, active)}'
            f'<p class="blog-region-note" data-region-note hidden></p></div></section>'
            f'<section class="blog-list"><div class="wrap">{featured}'
            + (f'<ul class="post-grid" data-region-list>{"".join(card(p) for p in chunk)}</ul>' if chunk else '')
            + f'{pagination(base, page, pages)}</div></section>{product_note()}</main>')
    return head(page_title, page_desc, path, schema=schema) + body + footer(all_posts)


def product_note() -> str:
    return ('<section class="blog-product"><div class="wrap"><div class="blog-product-card"><div><span class="eyebrow">About Stromule</span>'
            '<h2>One connected system for billing, stock and customer credit.</h2>'
            '<p>Stromule is billing, inventory and business management software from Kumpali Private Limited for small businesses. It launches on 14 December 2026.</p></div>'
            '<a class="btn green" href="/">See what we’re building <span aria-hidden="true">→</span></a></div></div></section>')


def post_page(p: Post, all_posts: list[Post]) -> str:
    cat_path = f'/blog/category/{p.cat_slug}/'
    crumbs = [('Home', '/'), ('Blog', '/blog/'), (p.category, cat_path), (p.title, p.url)]
    schema = [
        {'@type': 'BlogPosting', '@id': ORIGIN + p.url + '#article', 'headline': p.title, 'description': p.description,
         'datePublished': p.date.isoformat(), 'dateModified': p.updated.isoformat(), 'inLanguage': 'en',
         'author': {'@type': 'Organization', 'name': p.author, 'url': ORIGIN + '/'},
         'publisher': {'@id': f'{ORIGIN}/#organization'}, 'mainEntityOfPage': ORIGIN + p.url,
         'image': ORIGIN + p.cover if p.cover else f'{ORIGIN}/assets/social.png', 'articleSection': p.category, 'wordCount': p.words,
         'keywords': ', '.join(p.tags), 'isPartOf': {'@id': f'{ORIGIN}/blog/#blog'}},
        breadcrumb_schema(crumbs),
    ]
    if p.faq:
        schema.append({'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': str(i['q']).strip(),
                                                           'acceptedAnswer': {'@type': 'Answer', 'text': str(i['a']).strip()}} for i in p.faq]})
    extra = (f'<meta property="article:published_time" content="{p.date.isoformat()}">'
             f'<meta property="article:modified_time" content="{p.updated.isoformat()}"><meta property="article:section" content="{e(p.category)}">')
    toc = ''
    if len(p.toc) >= 3:
        toc = ('<nav class="post-toc" aria-label="On this page"><p class="post-toc-title">On this page</p><ol>'
               + ''.join(f'<li><a href="#{tid}">{e(name)}</a></li>' for tid, name in p.toc)
               + ('<li><a href="#faq">Frequently asked questions</a></li>' if p.faq else '') + '</ol></nav>')
    faq = ''
    if p.faq:
        faq = ('<section class="post-faq" id="faq" aria-labelledby="faq-title"><h2 id="faq-title">Frequently asked questions</h2><div class="faq">'
               + ''.join(f'<details><summary>{e(str(i["q"]).strip())}<span aria-hidden="true">+</span></summary><div><p>{e(str(i["a"]).strip())}</p></div></details>' for i in p.faq)
               + '</div></section>')
    cover = ''
    if p.cover:
        cover = (f'<figure class="post-cover wrap"><img src="{e(p.cover)}" alt="{e(p.cover_alt)}" width="{p.cover_size[0]}" height="{p.cover_size[1]}" '
                 'fetchpriority="high" decoding="async"></figure>')
    disclosure = '<span class="post-ai">AI-assisted, automatically checked</span>' if p.ai else ''
    related = ''
    if p.related:
        related = ('<section class="post-related" aria-labelledby="related-title"><div class="wrap"><h2 id="related-title">Keep reading</h2><ul class="post-grid">'
                   + ''.join(card(r) for r in p.related) + '</ul></div></section>')
    updated = (f' · Updated <time datetime="{p.updated.isoformat()}">{fmt_date(p.updated)}</time>' if p.updated.date() != p.date.date() else '')
    body = (f'<main id="main"><article class="post" data-region="{p.region}"><header class="post-header"><div class="wrap post-header-inner">'
            f'<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/blog/">Blog</a> <span aria-hidden="true">/</span> <a href="{cat_path}">{e(p.category)}</a></nav>'
            f'<h1>{e(p.title)}</h1><p class="post-lead">{e(p.description)}</p>'
            f'<p class="post-meta"><span>{e(p.author)}</span><span><time datetime="{p.date.isoformat()}">{fmt_date(p.date)}</time>{updated}</span><span>{p.minutes} min read</span>{disclosure}</p>'
            f'</div></header>{cover}<div class="wrap post-layout">{toc}<div class="post-body">{p.html}{faq}</div></div></article>'
            f'{related}{product_note()}</main>')
    image = (ORIGIN + p.cover, p.cover_size[0], p.cover_size[1], p.cover_alt) if p.cover else None
    return head(f'{p.title} | Stromule Blog', p.description, p.url, og_type='article', schema=schema, extra=extra, image=image) + body + footer(all_posts)


def feed(posts: list[Post]) -> str:
    items = ''.join(
        f'<item><title>{e(p.title)}</title><link>{ORIGIN}{p.url}</link><guid isPermaLink="true">{ORIGIN}{p.url}</guid>'
        f'<pubDate>{format_datetime(p.date)}</pubDate><category>{e(p.category)}</category><description>{e(p.description)}</description></item>'
        for p in posts[:20])
    built = format_datetime(posts[0].date if posts else datetime.now(timezone.utc))
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>'
            f'<title>Stromule Blog</title><link>{ORIGIN}/blog/</link><description>Practical guides on billing, inventory, customer credit and running a small business.</description>'
            f'<language>en</language><lastBuildDate>{built}</lastBuildDate><atom:link href="{ORIGIN}/blog/feed.xml" rel="self" type="application/rss+xml"/>{items}</channel></rss>\n')


# --- Homepage integration -----------------------------------------------------
def update_homepage(posts: list[Post]) -> None:
    index = ROOT / 'index.html'
    text = index.read_text(encoding='utf-8')
    latest = f'<ul class="post-grid post-grid-home" data-region-list>{"".join(card(p) for p in posts[:3])}</ul>' if posts else ''
    text, n = re.subn(r'<!-- latest-posts:start -->.*?<!-- latest-posts:end -->',
                      lambda _: f'<!-- latest-posts:start -->{latest}<!-- latest-posts:end -->', text, flags=re.S)
    assert n == 1, 'latest-posts markers missing from index.html'
    index.write_text(text, encoding='utf-8', newline='\n')


def build() -> None:
    now = datetime.now(timezone.utc)
    posts = load_posts(now)
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    pages = max(1, math.ceil(len(posts) / PAGE_SIZE))
    for page in range(1, pages + 1):
        # PAGE_SIZE posts per page; on page 1 the first of them is shown as the featured post.
        write('/blog/' if page == 1 else f'/blog/page/{page}/', listing_page(
            posts, posts, base='/blog/', page=page, pages=pages,
            title='Stromule Blog: Billing, Inventory & Small Business Guides',
            h1='The Stromule Blog',
            lead='Practical, plain-language guides on billing, stock, customer credit and running a small business.',
            desc='Practical guides for small businesses on billing and invoicing, inventory and stock management, customer credit and day-to-day shop operations.',
            active=None, crumbs=[('Home', '/'), ('Blog', '/blog/')]))
    for name, (slug, desc) in CATEGORIES.items():
        in_cat = [p for p in posts if p.category == name]
        if not in_cat:
            continue  # no empty (thin) category pages
        cat_pages = math.ceil(len(in_cat) / PAGE_SIZE)
        for page in range(1, cat_pages + 1):
            base = f'/blog/category/{slug}/'
            write(base if page == 1 else f'{base}page/{page}/', listing_page(
                in_cat, posts, base=base, page=page, pages=cat_pages, title=f'{name} Guides for Small Businesses | Stromule Blog',
                h1=name, lead=desc, desc=desc, active=name, crumbs=[('Home', '/'), ('Blog', '/blog/'), (name, base)]))
    for p in posts:
        write(p.url, post_page(p, posts))
    (OUT / 'feed.xml').write_text(feed(posts), encoding='utf-8')
    update_homepage(posts)
    waiting = len(list(CONTENT.glob('*.md'))) - len(posts)
    print(f'Blog: {len(posts)} published posts, {waiting} not yet published (drafts, scheduled or skipped), {pages} index page(s) -> {OUT.relative_to(ROOT)}/')


if __name__ == '__main__':
    if len(sys.argv) == 3 and sys.argv[1] == '--lint':
        target = Path(sys.argv[2])
        titles = set()
        for other in CONTENT.glob('*.md'):
            if other.resolve() != target.resolve():
                try:
                    titles.add(str(split_front_matter(other.read_text(encoding='utf-8'))[0].get('title', '')).strip().lower())
                except Exception:
                    pass
        problems = lint(target, titles)
        print(json.dumps({'ok': not problems, 'errors': problems}, ensure_ascii=False))
        sys.exit(1 if problems else 0)
    build()
