"""Read-only HTTP smoke checks; not proof of genuine search crawler identity."""
import argparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError
p = argparse.ArgumentParser(); p.add_argument('--base-url', default='https://stromule.com'); args = p.parse_args()
base = args.base_url.rstrip('/')
for route in ('/', '/privacy.html', '/terms.html', '/robots.txt', '/sitemap.xml', '/llms.txt', '/assets/social.png', '/indexnow-key.txt'):
    with urlopen(base+route, timeout=20) as response:
        assert response.status == 200, (route, response.status)
        assert 'noindex' not in response.headers.get('X-Robots-Tag', '').lower(), route
        assert response.read(), route
for bot in ('Googlebot', 'bingbot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot', 'facebookexternalhit', 'UnknownResearchCrawler'):
    with urlopen(Request(base+'/', headers={'User-Agent':bot}), timeout=20) as response:
        assert response.status == 200 and b'<h1' in response.read(), bot
try:
    urlopen(base+'/seo-nonexistent-route-7c2f/', timeout=20)
    raise AssertionError('Missing page must return 404')
except HTTPError as error:
    assert error.code == 404, error.code
print('HTTP checks passed: 8 public resources, 7 simulated user agents, missing route 404.')
