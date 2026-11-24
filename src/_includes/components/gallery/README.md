# Gallery

`{% gallery images, columns, masonry, frame, label %}` — data-driven. `images` is an array of paths or `{ src, alt?, caption?, width?, height? }`; `columns` defaults to `3`; `masonry` defaults to `false`; `frame` and `label` are optional (below). Thumbnails open in a `<dialog>` lightbox with previous/next, backdrop-click and Escape to close, and focus returned to the thumbnail. The container gets the shared staggered reveal (`--reveal-index`), see [`../reveal/README.md`](../reveal/README.md).

- Missing `alt` on an image logs a build warning.
- **Default layout:** uniform square thumbnails (`aspect-ratio: 1`, `object-fit: cover`) in a grid, one column at ≤640px.
- **Masonry (optional, third argument):** adds `gallery-masonry`, which switches to `display: grid-lanes` (CSS Grid Level 3) inside `@supports (display: grid-lanes)`. Browsers without support get a small JS fallback instead (below), and fall back to the square grid only if an image has no dimensions.
- Masonry needs each image's natural ratio or the layout shifts as lazy images load. With masonry on, the shortcode is async and adds `width`/`height` to every `<img>`: taken from the image object if you pass them, otherwise read at build time with `@11ty/eleventy-img` (`dryRun`). Unreadable images warn and render without dimensions.
- **Fallback:** `gallery.js` dynamically imports `fallback/masonry.js` only when `CSS.supports('display', 'grid-lanes')` is false, so supporting browsers never download it. It puts each image in the shortest column in DOM order (the Grid Lanes rule), sets `grid-column` and a `grid-row` span from the image's width/height ratio, and recomputes on resize with a `ResizeObserver`. Because the ratios come from the attributes, nothing waits on lazy images and the layout does not shift. The `.gallery-masonry-fallback` class is added only after the script has run.
- Grid Lanes places items in DOM order (unlike CSS `columns`), so lightbox order, tab order, and the reveal stagger all match what people see.
- Not used: third-party masonry libraries (extra dependency, layout shift, resize handling).
- **Image sources:** a path relative to `src/images/` (like `portfolio/tonya/agco-print.jpg`) is run through `@11ty/eleventy-img` into responsive AVIF/WebP/JPEG thumbnails (400/800/1600) and the lightbox opens the 1600px WebP, so the original is never shipped. A path starting with `/` or a URL is used as-is, as before.
- **Alt text and captions:** `alt` is optional; when it is missing the shortcode writes `<label> (n of N)` (`label` defaults to `Gallery image`; the portfolio layout passes the project title). A `caption` is shown under the image in the lightbox.
- **Social frame (optional, fourth argument):** `{ type: "instagram", handle, caption? }` wraps the gallery in a post-style frame: avatar initial and handle on top, then a swipeable one-image-at-a-time carousel (CSS scroll-snap, images cropped square), then icons, position dots and the caption. The frame is drawn with generic icons and no logo, and the width is `--gallery-frame-width` (30rem). A framed gallery ignores `columns` and `masonry`. The dots follow the scroll position with a small listener in `gallery.js`; the first dot is active in the markup so it works before the script runs. Clicking an image still opens the lightbox.

## On portfolio pages

A project's `images` list can mix plain images with groups. A group is an entry with a `gallery` list, plus optional `columns`, `masonry` and `frame`:

```yaml
images:
  - portfolio/tonya/agco-print.jpg
  - gallery:
      - portfolio/tonya/agco-detail-01.jpg
      - src: portfolio/tonya/agco-detail-02.jpg
        caption: Optional lightbox caption
    columns: 3
    masonry: true
  - gallery:
      - portfolio/tonya/agco-social-01.jpg
      - portfolio/tonya/agco-social-02.jpg
    frame:
      type: instagram
      handle: weareknights
      caption: Optional post caption.
```

Entries render in order. The portfolio grid uses the first image (or the first image of a leading group) as the cover. See [`../portfolio/README.md`](../portfolio/README.md).
