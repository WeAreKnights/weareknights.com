# Client logos

A grid of client logos, each in a bordered cell of equal size so wide and square logos sit evenly.

## Usage

```liquid
{% include "components/client-logos/client-logos.liquid", clients: author.clients %}
```

`clients` is an array of `{ name, logo }`: `name` is the alt text, `logo` is a path relative to `src/images/` (the files live in `src/images/clients/`). Today it's driven by a `clients` list on an author in `src/_data/authors.json` and shown on that author's page (`src/designers.liquid`) under a "Brands" heading, between the intro and the portfolio, so each designer can have their own.

## Notes

- Logos should be SVG. `responsiveImage` copies SVGs through as vector files (hashed filenames, width/height set) instead of rasterizing them; PNG/JPG logos still get the responsive AVIF/WebP/JPEG treatment.
- Cells are 2:1 boxes in an auto-fill grid (`--client-logo-min-cell`: 9rem, 7rem on phones), so the column count follows the available width. Logos are capped at `--client-logo-max-width` (8rem) and `--client-logo-max-height` (3.5rem), set on `.client-logos`, so wide and square marks end up visually balanced and none dominates; `object-fit: contain` means they never crop or stretch. An SVG with a lot of empty space in its viewBox will look small; trim the viewBox.
- Logos keep their own colors. Add a `filter: grayscale(1)` rule here if a uniform look is wanted.
- Add a logo by dropping the file in `src/images/clients/` and adding `{ "name": "...", "logo": "clients/file.svg" }` to the list. Order is the order of the list.
