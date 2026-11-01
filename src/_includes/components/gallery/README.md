# Gallery

`{% gallery images, columns, masonry %}` — data-driven. `images` is an array of `{ src, alt, width?, height? }`; `columns` defaults to `3`; `masonry` defaults to `false`. Thumbnails open in a `<dialog>` lightbox with previous/next, backdrop-click and Escape to close, and focus returned to the thumbnail. The container gets the shared staggered reveal (`--reveal-index`), see [`../reveal/README.md`](../reveal/README.md).

- Missing `alt` on an image logs a build warning.
- **Default layout:** uniform square thumbnails (`aspect-ratio: 1`, `object-fit: cover`) in a grid, one column at ≤640px.
- **Masonry (optional, third argument):** adds `gallery-masonry`, which switches to `display: grid-lanes` (CSS Grid Level 3) inside `@supports (display: grid-lanes)`. Browsers without support keep the square grid, so it degrades on purpose.
- Masonry needs each image's natural ratio or the layout shifts as lazy images load. With masonry on, the shortcode is async and adds `width`/`height` to every `<img>`: taken from the image object if you pass them, otherwise read at build time with `@11ty/eleventy-img` (`dryRun`). Unreadable images warn and render without dimensions.
- Grid Lanes places items in DOM order (unlike CSS `columns`), so lightbox order, tab order, and the reveal stagger all match what people see.
- Not built: JS masonry libraries (extra dependency, layout shift, resize handling).
