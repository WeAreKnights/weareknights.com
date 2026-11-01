# Forms

Covers the `{% form %}` component and the PHP endpoint in `src/api/`.

- `{% form to, action %}...{% endform %}` — both args optional, posts to `/api/contact.php` by default.
- Anti-spam order: origin check (403) → honeypot (fake success) → timing trap <3s (fake success) → math check (real 422). Only the math check tells a bot it failed — the rest fake success so bots don't learn to adapt.
- `to` is validated against the `TO_ADDRESSES` allowlist in `.env` server-side — never trust it directly, or the endpoint becomes an open relay.
- Any non-reserved field name becomes a line in the email body automatically; a field named `email` becomes ReplyTo, `name` drives the subject line.
- Secrets in `src/api/.env` (gitignored): `POSTMARK_TOKEN`, `FROM_ADDRESS`, `TO_ADDRESSES`. No `SITE_URL` — the origin check derives the host from the request itself, so it can't drift out of sync.
- No-JS fallback: plain POST → 303 redirect to `/contact/thank-you/` (success) or `/contact/?error=1` (failure).
- Known bug pattern: comparing `parse_url` host (no port) against `HTTP_HOST` (has port on non-standard ports) without stripping the port breaks the origin check for legit local requests — `normalize_host()` handles this, keep it if touching that function.
- **Local testing:** `php -S localhost:PORT -t _site` after `npm run build`. `eleventy --serve` does NOT execute PHP — it serves the raw source file, which breaks `response.json()` in `form.js` and shows a generic "something went wrong" error unrelated to the actual PHP logic.
