# Popup

A native `<dialog>`, either an automatic announcement or a manual popup opened from a button.

```liquid
{% popup "announcement" %}
	<h2>Spring bookings are open</h2>
	<a href="/contact/">Get in touch</a>
{% endpopup %}

{% popup "search", false, "Search" %}
	{% search %}
{% endpopup %}
```

- Arguments: `id` (default `popup`), `auto` (default `true`; `false` makes it manual), and an optional `label` that becomes the dialog's `aria-label` — give manual popups one.
- **Automatic** popups open on the visitor's first scroll (not on load; immediate interstitials hurt page-experience signals) and stay dismissed for 24 hours, remembered in `localStorage` under `popup-dismissed-<id>`. If storage is blocked they still work, they just reappear.
- **Manual** popups (`data-manual`) never auto-open and don't remember dismissal. Any element with `data-popup-open="<id>"` opens the popup with that id, e.g. `<button type="button" data-popup-open="search">`.
- Close with the × button, Escape, or a click on the backdrop. Focus returns to whatever opened it, and opening a manual popup focuses its first input (if it has one).
- The footer ships a manual `search` popup (see the search README); there is no default announcement.
