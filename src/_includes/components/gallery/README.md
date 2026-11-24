# Gallery

`{% gallery images, columns, masonry %}` — data-driven. `images` is an array of `{ src, alt, width?, height? }`; `columns` defaults to `3`; `masonry` defaults to `false`. Thumbnails open in a `<dialog>` lightbox with previous/next, backdrop-click and Escape to close, and focus returned to the thumbnail. The container gets the shared staggered reveal (`--reveal-index`), see [`../reveal/README.md`](../reveal/README.md).

- Missing `alt` on an image logs a build warning.
- **Default layout:** uniform square thumbnails (`aspect-ratio: 1`, `object-fit: cover`) in a grid, one column at ≤640px.
- **Masonry (optional, third argument):** adds `gallery-masonry`, which switches to `display: grid-lanes` (CSS Grid Level 3) inside `@supports (display: grid-lanes)`. Browsers without support get a small JS fallback instead (below), and fall back to the square grid only if an image has no dimensions.
- Masonry needs each image's natural ratio or the layout shifts as lazy images load. With masonry on, the shortcode is async and adds `width`/`height` to every `<img>`: taken from the image object if you pass them, otherwise read at build time with `@11ty/eleventy-img` (`dryRun`). Unreadable images warn and render without dimensions.
- **Fallback:** `gallery.js` dynamically imports `fallback/masonry.js` only when `CSS.supports('display', 'grid-lanes')` is false, so supporting browsers never download it. It puts each image in the shortest column in DOM order (the Grid Lanes rule), sets `grid-column` and a `grid-row` span from the image's width/height ratio, and recomputes on resize with a `ResizeObserver`. Because the ratios come from the attributes, nothing waits on lazy images and the layout does not shift. The `.gallery-masonry-fallback` class is added only after the script has run.
- Grid Lanes places items in DOM order (unlike CSS `columns`), so lightbox order, tab order, and the reveal stagger all match what people see.
- Not used: third-party masonry libraries (extra dependency, layout shift, resize handling).
