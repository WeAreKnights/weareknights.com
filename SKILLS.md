# SKILLS.md

Reference for future Claude sessions on Octane Ignitor, a reusable 11ty template — every project built from it inherits what's here, so keep additions consistent rather than one-off.

## Stack

- 11ty (Eleventy) + Liquid templating
- Vite bundles CSS/JS only (see Components below)
- Open Props CSS tokens, imported as individual modules in `base.css`, not the full bundle (~30% smaller). Need a new token: import its specific module, don't switch to the full bundle. Some tokens exist in multiple modules with different values (e.g. `--gray-0` in both `props.gray.css` and `props.gray-oklch.css`) — verify against what's live before changing source.
- **Use `props.shadows.light.css`, not `props.shadows.css`.** The plain `props.shadows.css` internally `@import`s `props.media.css` for a dark-mode `@media (--OSdark)` block, which uses `@custom-media` at-rules — a draft CSS feature Vite's lightningcss minifier doesn't understand, so they got left unparsed in the shipped bundle and logged as console warnings in the browser (no visible bug, but noisy). Since this project has already declined dark mode, `props.shadows.light.css` gives the exact same `--shadow-*`/`--inner-shadow-*` values with no dark-mode block and no `@custom-media` dependency. If dark mode ever gets added for real, this decision needs revisiting alongside it — don't just swap back to `props.shadows.css` for one new token without re-solving the `@custom-media` leak.
- `@11ty/eleventy-img` for responsive images (`responsiveImage` shortcode)
- No frontend framework, no CMS — plain HTML/CSS/ES6
- Hosted on GitHub Pages (`.github/workflows/deploy.yml` builds with `npm run build` on push to `main`; `src/CNAME` sets the domain). No Apache/PHP: there is no `.htaccess`, contact form, or `src/api/` on this site

## Conventions (don't deviate without being asked)

- Tabs, everywhere
- Comments are rare: one short header comment at the top of each non-trivial JS file saying what it does and why, plus an inline comment only where the reason isn't obvious from the code (a workaround, a browser quirk, a deliberate omission). Never comments that restate the code
- No abbreviations in names: write `button`, `element`, `event`, `index`, `navigation`, `previous`, `milliseconds`, not `btn`, `el`, `e`, `i`, `nav`, `prev`, `ms`. Accepted exceptions are web-standard terms: `id`, `url`, `html`, `css`, `json`, `src`, `alt`, `aria`
- Functions are verbs (`readDismissedAt`, `renderDots`); booleans start with `is`/`has`/`should` (`isHovered`, `shouldAutoplay`)
- No magic numbers or strings: give a value its own named constant that includes its unit (`dismissalDurationMilliseconds`, `preloadMargin`)
- Long functions are split into named steps rather than one block read top to bottom
- Shortcodes and exported helpers get a JSDoc block (`@param` with a type and a unit or example where it helps, `@returns`) so editors show hints and positional arguments are self-documenting. It is documentation only: no TypeScript, no build step
- Minimal, semantic HTML
- Modern ES6 + native CSS over JS/dependencies when the platform can do it
- Ask before adding an npm dependency
- `site.json` fields stay present but blank, never deleted

## Directory structure

```
config/                      Cross-cutting Eleventy config: components.js, filters.js, helpers/ (by topic: data, dates, html, posts, urls, video), image.js, schema.js, shortcodes.js, site.schema.json
scripts/                     Dev tooling run via npm scripts (new-component.js)
src/
  _data/                     site.json, nav.json, reviews.json — global data
  _includes/
    layouts/                 base.liquid, page.liquid, post.liquid
    partials/                non-componentized includes (head, footer, schema, badge, analytics)
    components/<name>/       template, CSS, client JS, (if shortcode) the generator, and a README.md — colocated
  assets/
    lib/                     shared client-side modules (when-visible.js) — outside the components/*/*.js bundle glob, imported by components
    main.js                  Vite entry — base.css, then globs in every component's CSS/JS
    styles/                  base.css (aggregator) + _theme/_reset/_type/_layout/_tables/_accessibility/_animation.css
    images/                  passthrough-copied as-is (logo, icon, opengraph image)
  images/                    raw source photos for eleventy-img — not passthrough-copied. Committed on this site, because the GitHub Pages build runs in CI and needs them
  pages/                     "Page" content type
  posts/                     "Post" content type (blog); .liquid or .md
  portfolio/                 Portfolio projects (.md), sorted by `order` via the `portfolioProjects` collection
  authors.liquid             One page per entry in _data/authors.json
```

## Components

Each component lives in `src/_includes/components/<name>/`, and **each component's own documentation lives in a `README.md` in that folder** — read it before changing the component, and update it in the same change. This file only holds what applies across components.

- **Components register themselves — there is no list to maintain.** `config/components.js` (called from `eleventy.config.js`) imports `components/<name>/<name>.eleventy.js` for every folder that has one, and `main.js` uses `import.meta.glob` to bundle every `*.css` and `*.js` directly inside a component folder (except `*.eleventy.js`, which is server-side only and must never reach the browser bundle). Adding a component = adding a folder; removing one = deleting the folder.
- **Naming contract:** the shortcode file must be `<folder-name>/<folder-name>.eleventy.js` and export a default `function (eleventyConfig)`. CSS/JS filenames are free, but keep them `<name>.css` / `<name>.js`. Files nested deeper than one level, and anything not `.css`/`.js`, are ignored by the bundle glob.
- **Cascade order is alphabetical by folder and is not a contract** — never write component CSS that only works because another component's CSS loads before or after it. (Checked when this was introduced: no two components style the same element with conflicting properties.)
- **Shortcode-based** (gallery, slider, social, popup, reviews, form, video, videoBackground, facebookEmbed, instagramEmbed, hours, pagination, search, sidebar): `<name>.eleventy.js` generates markup.
- **Template-only** (header, hero, badge, pill, post-list, map, portfolio, author, client-logos): just a `.liquid` file, plus CSS/JS if needed — `badge` has neither and that's fine.
- **New component: `npm run new:component -- <name> [--template] [--paired] [--js]`.** Creates the folder with `<name>.eleventy.js`, `<name>.css`, and a `README.md` skeleton (plus `<name>.js` with `--js`; `--paired` makes the shortcode wrap author-written markup; `--template` makes it a `.liquid` include instead of a shortcode). It refuses to overwrite an existing component and needs no registration. Restart `npm start` afterward — verified: `vite build --watch` doesn't notice a newly added component folder until the glob is re-evaluated (a restart, or touching `src/assets/main.js`), and Eleventy only loads a new `.eleventy.js` when its config reloads. Generated code is a stub: fill in the markup, use only `--color-*` theme tokens for color, and write the README.
- After creating or changing a component: verify with `npm run build`.
- `config/` holds things with no single component home: `filters.js` and `helpers/` (shared utilities, split by topic: `html.js` escaping, `data.js`, `urls.js`, `video.js`, `posts.js`, `dates.js`), `image.js` (`responsiveImage`, plus the build-time apple-touch-icon and publisher-logo rasterizing), `schema.js` (the JSON-LD builders: `localBusinessSchema`, `blogPostingSchema`, breadcrumbs), `shortcodes.js` (`faq`). Put a new JSON-LD builder in `schema.js`, not `shortcodes.js`.
- Non-visual includes (footer, head, schema, analytics) stay in `partials/`, not `components/`.

Component docs: [`facebook-embed`](src/_includes/components/facebook-embed/README.md) · [`form`](src/_includes/components/form/README.md) · [`gallery`](src/_includes/components/gallery/README.md) · [`header`](src/_includes/components/header/README.md) (nav dropdowns, sticky/transparent) · [`hours`](src/_includes/components/hours/README.md) · [`instagram-embed`](src/_includes/components/instagram-embed/README.md) · [`map`](src/_includes/components/map/README.md) · [`pagination`](src/_includes/components/pagination/README.md) · [`author`](src/_includes/components/author/README.md) · [`client-logos`](src/_includes/components/client-logos/README.md) · [`portfolio`](src/_includes/components/portfolio/README.md) · [`pill`](src/_includes/components/pill/README.md) · [`post-list`](src/_includes/components/post-list/README.md) (also covers blog/category/tag pages) · [`reveal`](src/_includes/components/reveal/README.md) · [`popup`](src/_includes/components/popup/README.md) · [`reviews`](src/_includes/components/reviews/README.md) · [`search`](src/_includes/components/search/README.md) · [`sidebar`](src/_includes/components/sidebar/README.md) · [`slider`](src/_includes/components/slider/README.md) · [`video`](src/_includes/components/video/README.md) · [`video-background`](src/_includes/components/video-background/README.md). Components not listed (hero, badge, social, button — CSS-only, see its README) have no README yet — add one if you make non-obvious changes to them.

## Theme tokens (`src/assets/styles/_theme.css`)

Color has one indirection layer: Open Props palette values → **semantic `--color-*` tokens** → components. Components and global styles must use the semantic tokens, never `--gray-*`/`--indigo-*`/etc. directly, so re-branding a client site is a handful of variable edits in `_theme.css` instead of a hunt through every component.

| Token | Role (default) |
|---|---|
| `--color-accent` / `--color-on-accent` | Brand accent fill: plain hero background, mobile menu and search icons / text on it (brand teal / white) |
| `--color-primary` / `--color-on-primary` | Links, buttons, nav button, search accent / text on them (indigo-7 / gray-0) |
| `--color-text` / `--color-text-muted` | Body text / secondary text — footer, tags, review meta, slider dots (gray-9 / gray-7) |
| `--color-page` | Body background behind the white page container (15% tint of the brand teal) |
| `--color-surface` | The `main` page container and raised controls (white) |
| `--color-surface-subtle` / `--color-surface-subtle-hover` | Pills and tags, and their hover (gray-2 / gray-3) |
| `--color-surface-dark` / `--color-on-dark` / `--color-on-dark-muted` | Hero base and lightbox controls, and text on dark surfaces (gray-8 / gray-0 / gray-3) |
| `--color-border` / `--color-border-subtle` | Form fields, cards, dividers / lighter frame (gray-4 / gray-3) |
| `--color-focus` | Focus ring (follows `--color-primary`) |
| `--color-danger` / `--color-success` / `--color-rating` | Form errors / form success / review stars (red-7 / green-7 / yellow-6) |

- `--color-text-muted` is gray-7 on purpose: `--gray-6` on `--gray-0` fails WCAG AA (3.15:1). Keep muted text at gray-7 or darker, and check contrast when retheming.
- Black scrims (`rgb(0 0 0 / n%)` for the popup backdrop, lightbox, and hero gradient) stay as literal values — they're overlays, not theme colors.
- Adding a token: only when two or more places need the same role. Add it to `_theme.css` and to this table.
- Per-client theming: edit the values in `_theme.css` (or point a token at a different Open Props value). Don't override tokens inside component CSS.

## Type scale (`src/assets/styles/_type.css`)

Fluid: every `--step-N` is `clamp(min, rem + vw, max)` interpolating between a 320px and a 1200px viewport. At 320px the body is 16px on a minor third (1.2) ratio; at 1200px it is 18px on a perfect fourth (1.333). The ratio grows with the viewport, so phones keep the same hierarchy with smaller headings. Sizes are `rem` tokens, never px (the root stays `html { font-size: 100% }`, so zoom and the visitor's browser text-size setting still work): `--step--1` · `--step-0` (body) · `--step-1` · `--step-2` · `--step-3` · `--step-4` · `--step-5`. Headings h1–h6 map to steps 4 → -1. Components use `font-size: var(--step-N)`, not Open Props' `--font-size-*`. To change the range or ratios, regenerate the clamp values (min/max rem from base × ratio^N; vw coefficient = (max−min)/(1200−320) × 16 × 100; intercept = min − slope × 320) rather than editing one step. Use `lh`/`em` only where a size should follow its context.

## Motion (`src/assets/styles/_animation.css`)
Components never hard-code durations or easings: use `--transition-fast` (`transition: opacity var(--transition-fast)`) for hover and state fades, `--duration-slow` with `--ease-standard` for scroll reveals. Reduced-motion visitors get both durations set to 0s. No animation library.

## Breakpoints

CSS variables don't work inside `@media`, so breakpoints are `@custom-media` in `src/assets/styles/_breakpoints.css`, which Lightning CSS compiles to plain media queries (`vite.config.js` enables it). A component stylesheet that uses one starts with `@import "../../../assets/styles/_breakpoints.css";`.

| Query | Value |
|---|---|
| `--sm-down` / `--sm-up` | `max-width: 640px` / `min-width: 640px` |
| `--md-down` / `--md-up` | `max-width: 960px` / `min-width: 960px` |

Use `@media (--sm-down) { … }`. Add a breakpoint to `_breakpoints.css` only when two or more places need it.

## Naming and escaping

- **Class names are whole words** (`.lightbox-previous`, `.slider-previous`), never shortened (`-prev`, `-btn`).
- **Class modifiers use a single hyphen** (`.button-outline`, `.gallery-masonry`, `.has-sidebar-left`), never BEM `--`. (CSS custom properties keep their `--` prefix, of course.)
- **Shortcodes escape author-supplied text** with `escapeHtml` (`config/helpers/html.js`) before putting it in markup or an attribute. JSON-LD goes through `jsonForScript` so `</script>` in text can't end the block.
- **Client scripts that wait for an element to scroll into view** use `whenVisible` from `src/assets/lib/when-visible.js` instead of hand-rolling an `IntersectionObserver`.
- Pages and posts can set `modified: YYYY-MM-DD` in front matter. It feeds the sitemap `lastmod` (with `date`; pages with neither get no `lastmod`) and the "last updated" line on the privacy and accessibility pages. Update it by hand when the content changes — it deliberately doesn't read git or file times.

## Shortcode patterns

- **Data-driven** (`gallery`, `social`, `reviews`): takes structured data, generates markup + JSON-LD.
- **Author-writes-markup** (`faq`, `slider`, `popup`, `form`, `videoBackground`): paired shortcode wraps caller-written HTML — use when layout flexibility matters more than a fixed data shape.
- Anything meaningful should emit its own JSON-LD when a schema.org type applies.
- External links (`target="_blank"`) always get `rel="noopener noreferrer"` + visually-hidden "(opens in a new tab)".

## Width utilities

- `.content` (80ch) — prose, the default `<article>` wrapper.
- `.container` (75rem) — header/footer/wide-but-bounded sections.
- Header/footer default full-width; add `.container` to `.header-inner`/`.footer-inner` to constrain.
- Set `fullWidth: true` in frontmatter to drop the automatic `.content` wrapper and control width per-`<section>` instead.

## Data model (`src/_data/site.json`)

Every field is described, and validated in the editor, by [`config/site.schema.json`](config/site.schema.json) — `site.json` points at it via its `$schema` key, so editors that support JSON Schema (VS Code, JetBrains, etc.) give hover docs, autocomplete, and warnings for things like a trailing slash on `url`, a non-GA4 analytics ID, or a malformed opening-hours entry. Update the schema in the same change whenever a field is added, renamed, or removed. Forks that predate a field will get an editor warning until they add it — that's intended.

| Field | Purpose |
|---|---|
| `title`, `description` | Site name and default meta description; title also feeds `og:site_name`, embeds, and the schema publisher/author |
| `image`, `logo` | Default Open Graph image / logo (an SVG logo is rasterized at build for schema) |
| `url` | Production origin, no trailing slash — canonical URLs, sitemap, robots, OG, schema |
| `agency` | Footer credit |
| `postsPerPage` | Posts per page on blog/category/tag listings (default 10); restart the dev server after changing |
| `timeZone` | IANA zone of the business (default `America/New_York`); the Hours component uses it for "today" |
| `googleAnalyticsId` | GA4 `G-…` ID; blank disables analytics |
| `googleAdsId`, `googleAdsConversion` | Google Ads `AW-…` tag (shares the gtag.js load) / conversion `AW-…/label`; blank disables each |
| `metaPixelId` | Meta Pixel ID; blank disables. PageView on every page |
| `header` | `{ sticky, transparent }` booleans; pages override with `headerSticky` / `headerTransparent` front matter |
| `googleFonts` | Google Fonts css2 query string; blank loads none |
| `social` | Profile URLs — feeds the `social` shortcode, `sameAs`, and the embeds' fallback links |
| `business` | schema.org LocalBusiness fields; `telephone` also drives the header's click-to-call button |

- Fields stay present but blank, never deleted.
- Guard optional fields with `{% if field != "" %}`, not `{% if field %}` — Liquid treats empty strings as truthy.

## SEO / accessibility / performance

- Posts emit `BlogPosting` JSON-LD (`blogPostingSchema` in `shortcodes.js`, called from `post.liquid`). Optional `modified` front matter feeds `dateModified` (falls back to `date`); author and publisher are the site's `title` as an Organization. Google's structured-data rules want a raster `logo` (PNG/JPG), not SVG — set `site.logo` accordingly on real projects or the publisher logo won't qualify for rich results.
- Open Graph: `og:type` defaults to `website`, `posts.json` sets `ogType: article`; `og:url`, `og:site_name`, `og:locale` are always emitted. No Twitter/X card tags — deliberately declined.
- Apple touch icon: iOS doesn't accept SVG, so `config/image.js` rasterizes `src/assets/images/icon.svg` to a 180×180 `/apple-touch-icon.png` on every build (`eleventy.before`). Give `icon.svg` an opaque background rect, or iOS renders transparent areas black.
- Publisher logo: Google wants a raster logo for `BlogPosting`, so when `site.logo` is an SVG, `config/image.js` rasterizes it to a 600px-wide `/assets/images/publisher-logo.png` on every build and `blogPostingSchema` points at that (`resolvePublisherLogo` in `helpers/urls.js`). A PNG/JPG `site.logo` is used as-is.
- Google Fonts: set `site.googleFonts` to the css2 query string (e.g. `family=Lato:wght@400;700&family=Montserrat:wght@700`) — `head.liquid` adds the preconnects and `display=swap` stylesheet; blank emits nothing. Then override `--font-body` / `--font-heading` (both default to Open Props `--font-sans`) in the project's CSS.
- Breadcrumb schema lives in `shortcodes.js`. Liquid tag args don't support filters (`{% x title | default: y %}` is a parse error) — `{% assign %}` first, then pass the plain variable.
- Muted text uses `--color-text-muted` (gray-7): `--gray-6` on `--gray-0` fails WCAG AA (3.15:1). See Theme tokens.
- Automatic popups wait for the visitor's first scroll before `showModal()` — immediate interstitials hurt page-experience signals. Don't revert without a specific reason.
- Hero images are a CSS `background-image`, not run through `eleventy-img` — known gap; fixing it means switching to `<img>`/`<picture>`, which changes how the gradient overlay layers. Treat as its own task.
- Any `<img>` not using `responsiveImage` needs manual `width`/`height` to prevent layout shift (see header logo).

## Build & dev

- `npm run build` = `vite build && eleventy && pagefind` (`build:assets`, then `eleventy`, then `build:search`) — order matters, don't reorder: Pagefind indexes the finished HTML in `_site`.
- `npm start` = `vite build --watch` + `eleventy --serve` in parallel via `&`/`wait`.

## Asset hashing (`vite.config.js`, `src/_data/manifest.js`)

- `main.css`/`main.js` get content-hashed filenames via Vite's manifest — the hash is content-based, not mtime-based (comment-only edits don't change it).
- `manifest.js` reads Vite's `manifest.json` and exposes `manifest.css`/`manifest.js` as global data — nothing in `.liquid` references the hashed filename directly.
- `addWatchTarget("_site/assets/.vite/manifest.json")` makes `eleventy --serve` pick up new hashes. Don't remove it — the dev server would silently stop reflecting CSS/JS changes.

## Testing workflow for changes

No test suite — verification is manual, via the dev server + Browser tools:
1. Make the change.
2. Add temporary test data/content if needed to see it (in a page such as `index.liquid`).
3. Verify in the Browser pane.
4. Remove the temporary content before finishing.
5. `rm -rf _site && npm run build` as a final sanity check.

## Known sandbox quirks (not project bugs)

If verifying interactions in this harness's embedded browser:
- Smooth scroll (`behavior: "smooth"`) doesn't animate — use `"instant"` to verify scroll-distance math.
- `<dialog>`'s `close` event doesn't reliably fire — hook the actual dismiss actions (button click, backdrop click, `cancel` event) instead of relying on `close`.
- Synthetic Escape/click actions sometimes don't register — a real click to focus the page first tends to fix it.
- `IntersectionObserver` doesn't re-fire on programmatic scroll — verify CSS hidden/visible states, then manually toggle the class to prove the transition works.
- `scrollTo()`/`scrollBy()` don't dispatch a native `scroll` event here — dispatch one manually to test scroll-triggered JS.

## Explicitly declined (don't re-suggest without new info)

- CMS (Decap or otherwise) — client base mostly emails change requests; WordPress covers the few who want to self-edit.
- Dark mode.
