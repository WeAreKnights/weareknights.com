# Sidebar

Optional, per page. Adds an `<aside>` next to the page content, on the left or right, and is off unless a page asks for it.

## Usage

Turn it on and write its content in the same page:

```liquid
---
sidebar: right
---

{% sidebar %}
	<div class="sidebar-widget">
		<h2>About this project</h2>
		<p>…</p>
	</div>
{% endsidebar %}
```

- `sidebar: left` or `sidebar: right` sets the side. Anything else (missing, `false`, a typo) renders no sidebar.
- **A sidebar needs both the setting and a `{% sidebar %}` block.** No block, no sidebar — so `sidebar: right` in `work.json` or `posts.json` is a safe section default: it only affects pages that actually write a block, and each of those gets its own content.
- `sidebarSticky: true` keeps it in view while scrolling on wide screens.
- `fullWidth: true` pages ignore `sidebar` — those pages control their own width per section.
- Works for every layout, since `base.liquid` does the wiring.

## Content

Each page writes its own sidebar in a paired `{% sidebar %}` block anywhere in its body. The block renders nothing in place; `base.liquid` prints it inside the `<aside>`.

- Any markup or shortcode works inside the block. Each widget is a `<div class="sidebar-widget">` with an `<h2>`.
- **Shared widgets are plain includes, used inside the block.** Nothing ships by default. When a project repeats a widget across pages (contact details, hours, a CTA, related links), put it in a partial and include it: `{% sidebar %}{% include "partials/contact-info.liquid" %}…page-specific widgets…{% endsidebar %}`.
- Works on pages generated from data or pagination: every output page gets its own block, with `{{ }}` variables resolved per page.

## How the content gets to the layout

Eleventy renders a page's content before its layouts. The `{% sidebar %}` shortcode stores its rendered HTML in a module-level `Map` (`sidebar.eleventy.js`), and the `sidebarContent` filter hands it back to `base.liquid`.

- **The key is `page.url`, not `page.inputPath`.** One template can write many output pages (pagination, data-driven pages), all sharing one input path; keyed by input path the last page rendered won and every page showed its sidebar (verified: three paginated pages all rendered the third one's widget).
- **The map is cleared on `eleventy.before`.** Otherwise removing a block from a page leaves its old sidebar showing in `eleventy --serve` until the dev server restarts (verified). Clearing per build is safe for incremental builds too, since pages that don't re-render aren't rewritten.
- `base.liquid` checks the setting, then the content, in nested `if`s on purpose; mixing `and`/`or` in one Liquid condition happens to work in LiquidJS (it evaluates right to left) but reads as the opposite and breaks in other Liquid engines.

## Accessibility

- Landmarks: `<main>` (hero, `<h1>`, article) then `<aside class="sidebar" aria-label="Sidebar">` as its **top-level sibling**. The ARIA Authoring Practices and axe (`landmark-complementary-is-top-level`) both want complementary landmarks top-level, not nested inside `main`.
- Main content first in the HTML for screen readers, crawlers, the skip link, and mobile. Left placement is CSS only (grid), so on the left the visual order (sidebar, content) differs from tab order (content, sidebar). That's the deliberate trade-off — don't reorder the HTML.
- `aria-label` names the landmark so it stays distinguishable if a page ever gets a second one.
- Don't use `<section>` for widgets: `reveal.js` fades in every `<section>` and would hide sidebar widgets until scrolled into view.

## How the layout works

`base.liquid` wraps `<main>` and the aside in `.has-sidebar` when `sidebar` is `left` or `right`. From 60em (the `--md-up` breakpoint, 960px) up, `.has-sidebar` is a named-line grid and `<main>` is a **subgrid** spanning the parent's two rows, so the hero (row 1) spans the full width, while the article (row 2) and the aside (row 2) sit in their own columns. That's how the hero stays full-bleed and inside `<main>` while the aside remains a sibling of `<main>`.

- **Don't move the hero out of `<main>` to simplify this.** The `<h1>` belongs in `<main>` (the skip link would otherwise land past the page title), and a `<header>` outside `<main>` becomes a second banner landmark.
- Subgrid is gated by `@supports`. Browsers without it (before Chrome 117 / Safari 16 / Firefox 71) get the stacked layout — sidebar below the content — which still works.
- Below 60em everything stacks, article first, and sticky is off. The sidebar supplies its own padding when stacked; in the grid the gutters are tracks.
- Widths: `--sidebar-width` 20rem, `--sidebar-gap`, `--sidebar-gutter`. The whole layout is capped at 75rem like `.container`, with the article's own `.content` margin and inline padding dropped.
- The aside sits outside `<main>`, which holds `data-pagefind-body`, so sidebar text never enters the search index.
