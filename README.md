# weareknights.com

Portfolio site for designers Mitchell Knight and Tonya Knight. Version 2.0, built on [Octane Ignitor](https://github.com/octane-agency/octane-ignitor) (11ty, Liquid, Vite, Open Props) and hosted on GitHub Pages.

- `npm install`, then `npm start` to develop and `npm run build` to build into `_site/`.
- Pushing to `main` runs `.github/workflows/deploy.yml`. In the repo's Settings → Pages, set the source to **GitHub Actions**.
- Blog posts go in `src/posts/`, portfolio projects in `src/portfolio/`, authors in `src/_data/authors.json`. Conventions and component docs are in `SKILLS.md`.
