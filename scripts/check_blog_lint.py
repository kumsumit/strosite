"""Prove the blog checks accept good posts and reject broken or unsafe ones."""
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_blog import lint  # noqa: E402

PARA = ('Counting stock every week keeps a small shop ahead of empty shelves and surprise shortages, '
        'and it turns guesswork into a simple routine that anyone at the counter can follow. ')
BODY = '\n\n'.join(f'## Section {i}\n\n' + PARA * 7 for i in range(1, 5))
FAQ = ('faq:\n  - q: "How often should I count?"\n    a: "Weekly."\n'
       '  - q: "What is a reorder level?"\n    a: "The point to reorder."\n'
       '  - q: "Why track stock?"\n    a: "To avoid shortages."\n')
HEAD = ('---\ntitle: "How to Track Stock in a Small Shop Every Week"\n'
        'description: "A practical weekly routine for counting stock, setting reorder levels and spotting losses early in a small shop."\n'
        'date: 2026-11-21T09:00:00+05:30\ncategory: Inventory & stock\nregion: global\n')
AI = HEAD + 'ai: true\n' + FAQ + '---\n\n' + BODY          # an AI-written post: strict honesty rules
HUMAN = HEAD + '---\n\nWe are excited to share an update. ' + PARA * 6   # a post written in the CMS


def check(name: str, text: str, expect: str | None) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / 'sample-post.md'
        path.write_text(text, encoding='utf-8')
        errors = lint(path)
    if expect is None:
        assert not errors, f'{name}: expected clean, got {errors}'
    else:
        assert any(expect in err for err in errors), f'{name}: expected an error containing "{expect}", got {errors}'


# AI-written posts
check('valid AI post', AI, None)
check('AI unhedged product claim', AI + '\n\nStromule lets you file returns in one click.', 'unhedged product claim')
check('AI availability claim', AI + '\n\nStromule is in development. Sign up today.', 'banned phrase')
check('AI external link', AI + '\n\nSee [this guide](https://example.com/guide).', 'external link')
check('AI specific tax rate', AI + '\n\nRice attracts GST at 5% in most cases.', 'specific tax/penalty rate')
check('AI too short', AI.replace(BODY, '## A\n\nShort.\n\n## B\n\nShort.\n\n## C\n\nShort.'), 'body must be')
check('AI missing faq', AI.replace(FAQ, ''), 'faq must list')
check('AI self-reference', AI + '\n\nAs an AI, I recommend counting weekly.', 'banned phrase')
# Posts written by people in the CMS
check('valid human post', HUMAN, None)
check('human may link out and describe Stromule',
      HUMAN + '\n\nStromule now offers billing. Read more on [our partner site](https://example.com).', None)
check('human post too short', HEAD + '---\n\nToo short.', 'body must be')
check('H1 in body', HUMAN + '\n\n# A second title', 'H1')
check('bad category', HUMAN.replace('Inventory & stock', 'Random'), 'category must be')
check('naive date', HUMAN.replace('+05:30', ''), 'time zone')
check('short description', HUMAN.replace('A practical weekly routine', 'Short'), 'description must be')
check('image linked from another site', HUMAN + '\n\n![Shelf](https://example.com/shelf.jpg)', 'must be uploaded')
check('missing uploaded image', HUMAN + '\n\n![Shelf](/assets/blog/does-not-exist.jpg)', 'image not found')
check('cover without description', HUMAN.replace('region: global\n', 'region: global\nimage: /assets/logo.png\n'), 'image_alt')
check('broken faq item', HUMAN.replace('region: global\n', 'region: global\nfaq:\n  - q: "Only a question?"\n'), 'faq item')
print('Blog checks passed: valid AI and human posts accepted; 17 broken or unsafe posts rejected.')
