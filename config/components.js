// Registers every component: loads `src/_includes/components/<name>/<name>.eleventy.js` for each folder (see SKILLS.md, Components).

import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const componentsDirectory = resolve(import.meta.dirname, "../src/_includes/components");

export default async function (eleventyConfig) {
	const names = readdirSync(componentsDirectory, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort();

	for (const name of names) {
		const file = resolve(componentsDirectory, name, `${name}.eleventy.js`);
		if (!existsSync(file)) continue;

		const { default: register } = await import(pathToFileURL(file).href);
		register(eleventyConfig);
	}
}
