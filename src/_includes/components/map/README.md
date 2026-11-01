# Map

Optional — only use on projects that want it. Ported from the `map-embed` partial in `axemen-tree`, `top-of-google-maps`, and `beach-getaways-signature`. A keyless Google Maps iframe: no API key, billing account, or script.

## Usage

```liquid
{% include "components/map/map.liquid", query: "East Cobb, GA" %}
{% include "components/map/map.liquid", query: "123 Main St, Marietta, GA", zoom: 15 %}
```

## Options

- `query` (required) — anything Google Maps search understands: a city, a full street address, or a business name. Renders nothing if blank.
- `zoom` — 1–21, defaults to `12` (city level). Use ~15 for a street address; the original sites used 11 or 12.

## Accessibility

- The iframe's `title` is "Map of <query>".
- A "View larger map" link below the iframe opens the same search on google.com/maps in a new tab, with the usual visually-hidden "(opens in a new tab)". It's the fallback for no-JS-blocked embeds and for anyone who wants directions.

## Notes

- **Keyless endpoint.** `maps.google.com/maps?q=…&output=embed` 301s to Google's modern keyless embed viewer and the browser follows it transparently. Don't test the URL with a HEAD request (`curl -I`) — HEAD misleadingly 404s regardless of validity; use a real GET or just load it in a browser. Don't swap it for the Maps Embed API (`/maps/embed/v1/…`), which requires an API key.
- Aspect ratio is 16:7 from 640px up, 4:3 below — a 16:7 map on a phone is only ~160px tall, too small to use. Framed with `--color-border` and `--radius-3`.
- `loading="lazy"` defers the iframe natively, so no JS is needed. The iframe's content isn't indexed; a map doesn't replace putting the address in the page text and `site.business.address` for schema markup.
- `referrerpolicy="no-referrer-when-downgrade"` is kept from the original sites, where it's known to work.
