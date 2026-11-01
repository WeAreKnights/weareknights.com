# Facebook Page embed

Optional — only use on projects that want it. Ported from East Cobb SNOBS, generalized from a site-coupled include into a shortcode that takes a URL. Needs no API key, access token, or third-party script.

- **`{% facebookEmbed url, tabs, height, compact, facepile %}`** — only `url` required; defaults `"timeline"`, `500`, `false`, `true` (Facebook's own defaults). `tabs` takes `timeline`, `events`, `messages` (comma-separated, others dropped); `compact` = small header + hidden cover.
- Non-Facebook URLs warn at build and render nothing.
- Always renders a plain link fallback below the iframe (`facebook-embed-fallback`) for no-JS, crawlers, and the platform blocking framing or the Page going private — don't remove it as "redundant".
- The iframe's content is not indexed, and only public Pages work.

Lessons learned the hard way on SNOBS — don't undo:
- Uses Meta's Page Plugin iframe URL directly, not the SDK (`sdk.js`/`.fb-page`) and not the `adapt_container_width` param — both gave inconsistent, sometimes much-narrower-than-500 results. The hand-rolled iframe is deterministic.
- Hard 180–500px width limit from Facebook's endpoint. Forcing the `<iframe>` wider than its `width` param just leaves blank space; it does not reflow.
- `facebook-embed.js` measures `.facebook-embed-frame` (must stretch full width via CSS — don't rely on flex sizing it to content, it silently measures ~0), clamps to `[180, 500]`, sets that as the `width` param, and re-measures on debounced resize.
- Iframe is created only when the embed is within 200px of the viewport (`IntersectionObserver`), so nothing contacts Facebook for visitors who never scroll to it. `--facebook-embed-height` reserves space under `html.js` to prevent layout shift.
- The timeline takes a few seconds to visibly populate after the iframe loads (Facebook's own JS inside the frame) — that delay is normal.
