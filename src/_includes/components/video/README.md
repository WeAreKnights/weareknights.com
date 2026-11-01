# Video embeds

`buildVideoEmbedUrl(url, { autoplay, muted, loop, hideControls })` in `config/helpers/video.js` is the single URL builder for both YouTube and Vimeo — all flags default `false`, so a bare call returns a clean embed URL with no query params (controls shown, sound on, no autoplay). Three places build on it, each passing only the flags it needs:

- **`{% video url %}`** (regular embed) — no flags, plain embed, exactly what a visitor would expect from pasting the URL in themselves.
- **`{% video url, true %}`** (regular embed, autoplay on scroll) — renders the iframe with no `src` at all (`data-src` holds the muted-autoplay URL instead), and `video.js`'s `IntersectionObserver` sets `iframe.src` the first time it scrolls into view. Muted, not looped, controls stay visible so the visitor can unmute — unmuted autoplay is blocked by every modern browser regardless of what the URL says, so this is muted-by-default with a visible unmute control, not real unmuted autoplay.
- **`videoEmbedUrl` filter / `videoBackground` shortcode** (background video) — `autoplay: true, muted: true, loop: true, hideControls: true`. Used in `hero.liquid` as `{{ video | videoEmbedUrl: true }}` (the filter translates the boolean into the flag object) and inside the `videoBackground` shortcode for use elsewhere.

Background video (the `videoBackground` shortcode and hero background) is documented in [`../video-background/README.md`](../video-background/README.md).
