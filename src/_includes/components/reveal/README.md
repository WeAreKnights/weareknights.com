# Scroll reveal

- Single shared `IntersectionObserver` in `reveal.js`, opt-in via `<section>` or `.reveal` class.
- Gallery items add a staggered variant: `--reveal-index` inline style → `transition-delay` in CSS. Reuse this pattern for future staggered components, don't reinvent it.
- Guarded by `html.js` (no-JS = full content immediately) and `prefers-reduced-motion: no-preference`.
