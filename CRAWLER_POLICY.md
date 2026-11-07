# Public crawler policy

All public content is allowed by `User-agent: * / Allow: /`. Search, AI discovery, user-requested fetching, training, social previews, research, archival, accessibility and unknown crawlers inherit the same permission. No bot-specific user-agent identifiers are implemented, so a provider rename cannot accidentally exclude it. The rule includes CSS, scripts, images and fonts; it is not a security allowlist.

Official documentation checked on 7 November 2026:

- OpenAI: OAI-SearchBot (search), ChatGPT-User (user fetching), GPTBot (training): https://developers.openai.com/api/docs/bots
- Anthropic: Claude-SearchBot (search), Claude-User (user fetching), ClaudeBot (training): https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Google: Googlebot variants and GoogleOther; Google-Extended is a product-use control token, not a separate HTTP crawler: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- Apple's official reference was rate limited during this audit: https://support.apple.com/en-us/119829. Applebot-Extended is a control token, not a separate crawler. Recheck official documentation before adding an Apple-specific restriction.
- Perplexity's requested documentation endpoint could not be fetched during this audit: https://docs.perplexity.ai/guides/bots. PerplexityBot and Perplexity-User are representative policy test strings, not a claim of freshly verified identities.

The prompt's remaining bot names are not installed as a curated, verified registry. They, and partner indexing systems used by other search engines, are allowed through the wildcard. Do not invent Yahoo/Ecosia/Qwant tokens or imply that every named string is active. Bot names in tests simulate rule interpretation only.

Training permission differs from search permission and does not guarantee search inclusion. To change a future training policy, verify each provider's current controls, document the decision, then add precise rules without blocking search/user fetching. llms.txt is an informational proposal, not access control or an indexing guarantee: https://llmstxt.org/. Google AI search follows ordinary search eligibility; no special AI markup is required: https://developers.google.com/search/docs/appearance/ai-features.

For CDN/WAF administration, verify genuine crawlers using provider-published IP ranges or documented forward-confirmed reverse DNS as applicable. Never grant privileged access based on a spoofable User-Agent. Keep authentication, private application data and API protections intact. This repository has no CDN configuration or authenticated application endpoints. No firewall protections were disabled.
