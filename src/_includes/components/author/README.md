# Author

Authors live in `src/_data/authors.json` (`id`, `name`, `bio`, `avatar`, optional `social`). `avatar` is relative to `src/images/` and goes through `responsiveImage`.

- `author.liquid`: the avatar tile used in the grid on the About page. Needs `author` (a record from `authors`).
- `author-links.liquid`: social links for one author. Icons exist for `github` and `dribbble`; add another `{% elsif %}` branch for a new platform. Links open in a new tab with the visually-hidden notice.
- `/authors/<id>/` pages come from `src/authors.liquid` (bio, links, portfolio, posts).
- Posts and portfolio projects reference an author with `author: mitchell` / `designer: mitchell`. Look one up in a template with `{% assign author = authors | where: "id", id | first %}`.

```liquid
<div class="author-grid">
	{% for author in authors %}{% include "components/author/author.liquid" %}{% endfor %}
</div>
```
