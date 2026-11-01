# Reviews

- `{% reviews reviews %}` renders the cards only. Its schema.org `aggregateRating` and `review` entries are merged into the page's single `LocalBusiness` JSON-LD node (`localBusinessSchema` in `config/schema.js`, which `head.liquid` emits on every page) via `setPageReviews`, keyed by `page.url` like the sidebar. They used to be a second `LocalBusiness` node with the same `@id`; don't bring that back.
- Review text, names, and sources are escaped, so they are plain text, not HTML.

- Review text clamps at 5 lines (`-webkit-line-clamp`, guarded under `html.js` so no-JS visitors always get the full text) with a "Read more"/"Read less" toggle. The toggle button starts `hidden` and `reviews.js` only un-hides it if `scrollHeight > clientHeight` on that specific review's text — a short review that doesn't overflow never gets a toggle at all.
- **`[hidden]` needs an explicit `display: none` override if the same selector also sets `display` elsewhere.** `.review-toggle { display: block }` was silently defeating the browser's built-in `[hidden] { display: none }` UA rule (author CSS wins over UA styles at equal specificity), so the button showed even while `hidden` was set. Fixed with `.review-toggle[hidden] { display: none; }`. Same risk applies to any other element that's toggled via the `hidden` attribute but also has its own unconditional `display` rule.
