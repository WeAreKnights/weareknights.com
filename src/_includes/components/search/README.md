# Search

Pagefind, on by default. `npm run build` runs `pagefind --site _site` after `eleventy` (`build:search`), which indexes the built HTML into `_site/pagefind/` (a few hundred ms on a small site). `{% search %}` renders the mount point; `search.js` loads Pagefind's UI (`/pagefind/pagefind-ui.js` + `.css`) only when the mount point is near the viewport and falls back to a message if the index isn't there.

**Where it lives:** there is no search page. `footer.liquid` holds a manual popup (`{% popup "search", false, "Search" %}{% search %}{% endpopup %}`), and the search icon button in the header (`.nav-search`, `data-popup-open="search"`) opens it. The input is focused when the popup opens (`autofocus` is on whenever the mount point is inside a `<dialog>`). Because the mount point is hidden while the dialog is closed, it only counts as "near the viewport" — and Pagefind only loads — the first time the popup opens. `{% search %}` still works anywhere else, e.g. on a page of its own.

- Only content inside `<main data-pagefind-body>` is indexed (set in `base.liquid`, skipped for `noindex` pages), so header/footer/nav text never shows up in results. Pagefind excludes any page without that attribute once any page has it.
- **Dev:** `npm start` (eleventy `--serve`) does not build the index — search shows "unavailable" until you've run `npm run build` at least once, and its index goes stale as content changes.
- Pagefind's fixed-name files (`pagefind*.js/css/json`) get a short 1-hour cache in `.htaccess` instead of the 1-year immutable rule for css/js, so a Pagefind upgrade can't leave an old script talking to a new index format.
- Search needs JS; `<noscript>` explains that.
- **Removing search from a project:** delete `components/search/`, remove the search popup from `footer.liquid` and the `.nav-search` button from `header.liquid` (plus its `.nav-search` rules in `header.css`), remove `build:search` from `package.json`'s `build` script, and `npm uninstall pagefind`. (No registration to undo — components register themselves.) `data-pagefind-body` in `base.liquid` is harmless to leave.
