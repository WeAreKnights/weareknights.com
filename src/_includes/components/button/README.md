# Button

CSS-only component — no shortcode. Put the classes on an `<a>` or `<button>`.

```html
<a class="button" href="/contact/">Contact us</a>
<a class="button button-outline" href="/about/">About</a>
<button class="button button-subtle" type="button">Cancel</button>
```

- **`.button`** — solid `--color-primary` fill. **`.button-outline`** and **`.button-subtle`** are modifiers: always combine them with `.button`.
- Hover, focus ring, and disabled are shared. Disable a link with `aria-disabled="true"`; a real `<button>` uses `disabled`.
- Colors come only from `--color-*` tokens, so retheming stays in `_theme.css`. Primary hover is `filter: brightness(0.92)` rather than a new token — add a hover token only if a second place needs it.
- Modifier classes use a single hyphen on purpose (no BEM `--`).
- `.nav-button` and the form submit use `.button`; keep their own CSS to layout only.
