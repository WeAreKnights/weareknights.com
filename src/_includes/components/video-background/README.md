# Video background

Background video shares one URL builder with the regular video embed — see [`../video/README.md`](../video/README.md) for `buildVideoEmbedUrl` and how the flags work. `videoBackground` and the hero use `autoplay: true, muted: true, loop: true, hideControls: true`.

Background-specific notes:
- Covers via container query units (`cqw`/`cqh`) + `container-type: size`, not `vw`/`vh` — don't swap back, `vw`/`vh` only covers elements that match the viewport's own size.
- Explicit z-index required: video (0) < overlay (1) < content (2) — don't remove, stacking isn't automatic here.
- Backgrounds are Vimeo-only in practice now (the `scale(1.3)` workaround for YouTube's internal pillarboxing was removed) — if YouTube backgrounds come back, re-check for edge bars before assuming the cover math alone is enough.
