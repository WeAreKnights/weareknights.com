# Instagram embed

Optional — only use on projects that want it. Ported from East Cobb SNOBS, generalized from a site-coupled include into a shortcode that takes a URL. Needs no API key, access token, or third-party script.

- **`{% instagramEmbed url, height %}`** — accepts a profile URL or a post/reel/`tv` URL, normalizes it, and iframes `https://www.instagram.com/<handle-or-p/id>/embed`. Only `url` required; `height` defaults to `500`.
- Non-Instagram URLs, and Instagram URLs with no profile or post, warn at build and render nothing.
- Always renders a plain link fallback below the iframe (`instagram-embed-fallback`) for no-JS, crawlers, and the platform blocking framing or the account going private — don't remove it as "redundant".
- The iframe's content is not indexed, and only public accounts work.
- Plain `loading="lazy"` iframe, no JS. Confirmed no `X-Frame-Options`/`frame-ancestors` blocking on public accounts as of the SNOBS migration.
