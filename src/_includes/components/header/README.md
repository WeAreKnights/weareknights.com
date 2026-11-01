# Header

Nav lives in `src/_data/nav.json`; the header template is `header.liquid`, with `nav-link.liquid` rendering each link.

## Dropdowns

Give a nav item a `children` array (one level only). `url` on the parent is optional: with it the parent is a link plus a chevron button, without it the whole label is the button.

```json
{ "label": "About", "url": "/about/", "children": [
	{ "label": "Team", "url": "/about/team/" },
	{ "label": "Partner", "url": "https://example.com", "external": true }
] }
```

- Disclosure pattern: the button toggles `aria-expanded`; Escape and clicking elsewhere close it, and Escape returns focus to the button. On mobile the submenu opens inline inside the hamburger menu.
- Without JS the chevron is hidden and the menu opens on hover/focus-within instead.

## Search button

The magnifier button (`.nav-search`) sits before the phone button and opens the footer's search popup (`data-popup-open="search"`); see the search and popup READMEs. It is hidden without JS, since search needs JS.

## Sticky and transparent

- Site-wide: `header.sticky` / `header.transparent` in `site.json` (both default `false`).
- Per page: `headerSticky: true|false` and `headerTransparent: true|false` in front matter override the site setting.
- **Transparent** overlays the header on the page's first section with `--color-on-dark` text, so only use it on pages that start with a dark hero, and use a light logo. Without sticky, it scrolls away with the page.
- **Sticky + transparent** is `position: fixed` and turns solid (`--color-surface`) once the page scrolls (`header.js` adds `.is-scrolled`). The solid state is also used while the mobile menu is open.
- Sticky headers can cover the target of in-page `#anchor` links; add `scroll-margin-top` to those targets if needed.
