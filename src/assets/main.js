// Entry point for the Vite bundle: base styles plus every component's CSS and JS (see SKILLS.md, Components).

import "./styles/base.css";

import.meta.glob(
	["../_includes/components/*/*.css", "../_includes/components/*/*.js", "!../_includes/components/*/*.eleventy.js"],
	{ eager: true }
);
