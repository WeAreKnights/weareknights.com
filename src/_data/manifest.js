// Reads Vite's manifest to give templates the hashed CSS/JS filenames.

import { readFileSync, existsSync } from "node:fs";

const manifestPath = "_site/assets/.vite/manifest.json";

export default function () {
	if (!existsSync(manifestPath)) {
		const message = "Vite manifest not found: run `npm run build:assets` (or `npm run build`) before Eleventy.";
		// `npm start` runs Vite and Eleventy together, so the manifest can legitimately be a moment late in dev.
		if (process.env.ELEVENTY_RUN_MODE === "build") throw new Error(message);
		console.warn(message);
		return { js: "", css: "" };
	}

	const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
	const entry = manifest["src/assets/main.js"];

	if (!entry) throw new Error(`"src/assets/main.js" is missing from ${manifestPath}.`);

	return {
		js: `/assets/${entry.file}`,
		css: entry.css?.[0] ? `/assets/${entry.css[0]}` : "",
	};
}
