# Portfolio

Project grid with optional designer/category filters, plus the project pages (`layouts/portfolio-item.liquid`, including the credits list) and the `/portfolio/` page (`pages/portfolio.liquid`).

## Usage

```liquid
{% include "components/portfolio/portfolio.liquid", items: collections.portfolioProjects, isFilterable: true %}
```

Projects are Markdown files in `src/portfolio/`; `portfolio.json` sets the layout, the `portfolio` tag, and the `/portfolio/<slug>/` permalink.

```yaml
---
title: Project Title
description: Meta description.
designer: mitchell        # an id from src/_data/authors.json
category: Branding
images:                   # one or more, relative to src/images/; the first is the grid cover
  - portfolio/client/first.jpg
  - src: portfolio/client/second.jpg   # or an object with a caption
    caption: Website
order: 1
credits:                  # optional
  - role: Photography
    name: Jasmine Ruiz
    url: https://example.com/jasmine-ruiz   # optional
---
```

## Options

- `items`: array of portfolio collection items. Use `collections.portfolioProjects` (sorted by `order`, lowest first; a missing `order` counts as 0).
- `isFilterable` (default off): shows a designer group and a category group, each only when the items contain more than one distinct value. Filtering is client-side by `data-designer` / `data-category`; `?designer=mitchell` and `?category=web` preselect a filter.

## Accessibility

- Filter buttons are real `<button>`s with `aria-pressed`. Filtered-out tiles use `hidden`.
- Tile alt text is the project title.

## Notes

- The mosaic spans (1/2/2/1) count hidden tiles, so after filtering the rhythm can shift. That matches how the old site behaved.
- An `images` entry is either a path or `{ src, caption }`; the two can be mixed. A caption shows under the image on the project page and becomes its alt text (`Title: Caption`); without one the alt text is `Title (n of N)`. The grid tile only uses the first image's path.
- A project is one page with all its images stacked, so group a client's work into one file (`arya-laya.md` has 6). A single `image:` string still works for one-image projects.
- Images must be files in `src/images/` (see `responsiveImage` in `config/image.js`), not passthrough assets.
- Don't wrap a long grid in a `<section>`: the shared reveal observer needs 15% of a section visible, so a tall grid stays invisible. `pages/portfolio.liquid` uses a `div` for this reason.
