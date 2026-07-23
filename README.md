# weareknights.com

Portfolio site for designers Mitchell Knight and Tonya Knight, built with [Eleventy](https://www.11ty.dev/) and [Open Props](https://open-props.style/).

## Structure

- `src/blog/` — blog posts (Markdown, one directory data file sets the post layout)
- `src/portfolio/` — portfolio projects (Markdown), rendered as a filterable grid at `/portfolio/`
- `src/_data/authors.json` — author/designer records used by blog posts and portfolio items
- `src/categories/`, `src/tags/`, `src/authors/` — paginated archive templates that generate one page per category, tag, and author
- `src/_includes/layouts/` — Liquid layouts (`base`, `page`, `post`, `portfolio-item`)
- `src/css/style.css` — site styles built on Open Props tokens

## Development

```bash
npm install
npm run serve
```

## Build

```bash
npm run build
```

Outputs to `_site/`.

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site and publishes it to GitHub Pages. In the repo's Settings → Pages, set the source to **GitHub Actions**.

A `CNAME` file (`src/CNAME`) is included for the `weareknights.com` custom domain — update or remove it if that's not the intended setup, and configure the corresponding DNS records with your registrar.

## Adding content

**Blog post** — add a Markdown file to `src/blog/` with front matter:

```yaml
---
title: Post Title
date: 2026-01-01
post_author: mitchell # or tonya, see src/_data/authors.json
categories: [Branding]
tags: [strategy]
excerpt: One-line summary shown in listings.
---
```

**Portfolio project** — add a Markdown file to `src/portfolio/`:

```yaml
---
title: Project Title
designer: mitchell # or tonya
category: Branding
image: /img/portfolio/your-image.jpg
order: 1
---
```
