# Pill

Small, all-caps label with a 1px border and a fully rounded shape. For tags, categories, and short section labels.

## Usage

```html
<span class="pill">Websites</span>
<a class="pill" href="/blog/tag/seo/">SEO</a>
<span class="pill pill-solid">Home Services</span>
<legend class="pill">Are you human?</legend>
```

Or through the include, which picks `<a>` or `<span>` for you:

```liquid
{% include "components/pill/pill.liquid", label: "SEO", href: "/blog/tag/seo/" %}
{% include "components/pill/pill.liquid", label: "Marketing", href: "/blog/category/marketing/", variant: "solid" %}
```

Wrap a group in `.pill-list` (flex, wraps, `--size-2` gap).

## Options

- `label` — the text. Write it in sentence or title case; CSS uppercases it.
- `href` — optional. With it the pill is a link, without it a `<span>`.
- `variant` — `"solid"` fills the pill black (`.pill-solid`). Default is outline.

## Where it's used

- The "Are you human?" legend on forms (a `<legend>`).
- Anywhere else a short label or tag is needed; the `pill.liquid` include is not used elsewhere yet.

## Accessibility

- Text is 12px at weight 600 in `--color-text` on the page background; solid pills are `--color-surface` on `--color-text`. Both pass AA.
- A pill is not interactive unless it is an `<a>`; hover and focus only change the colors of links.

## Notes

- Border and text use `currentColor`, so a pill can be recolored by setting `color` on it or a parent.
