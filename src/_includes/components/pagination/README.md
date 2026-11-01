# Pagination

Numbered page links for the blog, category, and tag listings.

```liquid
{% assign currentPage = pageNumber | plus: 1 %}
{% pagination currentPage, totalPages, "/blog", "Blog pagination" %}
```

- Arguments: current page (1-based), total pages, base path with no trailing slash, and an `aria-label` (default "Pagination"). Page 1 links to `<basePath>/`, page N to `<basePath>/page/N/`.
- Renders nothing when there is one page or fewer.
- Shows the first and last page and the current page ±1, with "…" between gaps (a gap of a single page shows that page instead). Previous/Next are omitted at the ends; they carry `rel="prev"`/`rel="next"`.
- The current page is `aria-current="page"`; each number has `aria-label="Page N"`. The "…" is `aria-hidden`.
- It draws its own top border and spacing, so don't add an `<hr>` above it.
- **Posts per page** is `postsPerPage` in `site.json` (default 10). Eleventy's built-in `pagination.size` can't read site data from front matter, so `eleventy.config.js` reads `site.json` itself and builds the pre-chunked `blogPages`, `postCategoryPages`, and `postTagPages` collections with that size; the templates paginate those with `size: 1`. Restart `npm start` after changing the setting (a watched data file isn't re-read by the config).
- The shared archive body is `partials/post-archive.liquid` (post-list + this nav); extend that, not each template.
