# Slider

`{% slider columns, autoplay, label, dots %}...{% endslider %}` — paired shortcode, author writes the slides as direct children (cards, `<figure>` images, `{% video %}` embeds, anything). All args optional: `columns` = 3, `autoplay` = `false` (`true` = 5s, or a number of seconds), `label` = `"Slides"` (accessible name — set a real one when a page has several), `dots` = `true`.

- Built on native `overflow-x` + `scroll-snap`, so touch swipe, trackpad and keyboard scrolling are the browser's own — no drag/pointer code. Without JS it's still a swipeable/scrollable strip (scrollbar only hidden under `html.js`).
- Columns are responsive in CSS: `columns` on desktop, capped at 2 at ≤960px, 1 at ≤640px (`--slider-current-columns`). Gap is `--slider-gap`.
- `slider.js` adds the controls, not the shortcode: previous/next, dots, and (autoplay only) a pause button all live in one `.slider-controls` row *below* the slides. They were originally overlaid on the slides but that hid card/video content — don't move them back over the content.
- Previous/next move one *page* (`perView` slides) and wrap at the ends. Dots are one per page, computed from measured layout, so they re-render on resize. Controls hide themselves when everything already fits.
- A11y: wrapper is `role="group"` + `aria-roledescription="carousel"` + label; each slide gets `aria-roledescription="slide"` and "n of N" (plus `role="group"` on `div`/`section` slides only, so `article`/`figure`/`li` semantics aren't overridden). No `aria-live` — scrolling doesn't mutate the DOM, so it would announce nothing.
- Autoplay (WCAG 2.2.2): visible pause/play button, plus automatic pause on hover, focus inside, tab hidden, or slider off-screen. Disabled entirely under `prefers-reduced-motion` (and smooth scrolling is CSS-gated the same way). A user pause sticks until they resume.
- Not built (deliberately, for size): mouse drag-to-scroll on desktop, partial "peek" of the next slide, and the newer CSS `::scroll-button()`/`::scroll-marker` carousel primitives (browser support was still uneven — recheck before adopting).
- Sandbox: smooth scroll doesn't animate and programmatic scrolls don't fire `scroll` events/`requestAnimationFrame` promptly here — set `track.style.scrollBehavior = "auto"`, dispatch `scroll` manually, and wait ~1s to verify dots.
