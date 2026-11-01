# Author

Authors live in `src/_data/authors.json` (`id`, `name`, `bio`, `avatar`, optional `about`, `social`, `clients`). `bio` is the one-line summary used on the About tile and as the page's meta description; the optional `about` is a longer paragraph shown as the intro on the author's own page (it falls back to `bio`). `avatar` is relative to `src/images/` and goes through `responsiveImage`.

- `author.liquid`: the avatar tile used in the grid on the About page. Needs `author` (a record from `authors`).
- `author-links.liquid`: social links for one author. Icons exist for `github`, `dribbble` and `linkedin`; add another `{% elsif %}` branch for a new platform. Links open in a new tab with the visually-hidden notice.
- `/designers/<id>/` pages come from `src/designers.liquid` (about text, links, brands, portfolio, posts). The URL says "designers" while the data and front matter keys (`authors.json`, `author:`) keep the name "author".
- Posts and portfolio projects reference an author with `author: mitchell` / `designer: mitchell`. Look one up in a template with `{% assign author = authors | where: "id", id | first %}`.

```liquid
<div class="author-grid">
	{% for author in authors %}{% include "components/author/author.liquid" %}{% endfor %}
</div>
```
- The first sentence of a designer's intro (`about`, else `bio`) is rendered large with the shared `.lead` class from `_type.css`; the rest follows as a normal paragraph. The split is on the first `. `, so avoid a period followed by a space in that opening sentence (e.g. an abbreviation like "Inc. ").
