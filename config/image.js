// Image setup: the apple-touch-icon and publisher logo built before each run, and the `responsiveImage` shortcode.

import { readFileSync } from "node:fs";
import Image from "@11ty/eleventy-img";
import { publisherLogoPath, resolvePublisherLogo } from "./helpers/urls.js";

export default function (eleventyConfig) {
	eleventyConfig.on("eleventy.before", async () => {
		await Image("./src/assets/images/icon.svg", {
			widths: [180],
			formats: ["png"],
			outputDir: "./_site/",
			filenameFormat: () => "apple-touch-icon.png",
		});

		const { logo } = JSON.parse(readFileSync("./src/_data/site.json", "utf8"));

		if (logo && resolvePublisherLogo(logo) === publisherLogoPath) {
			await Image(`./src${logo}`, {
				widths: [600],
				formats: ["png"],
				outputDir: "./_site/assets/images/",
				filenameFormat: () => "publisher-logo.png",
			});
		}
	});

	/**
	 * Responsive `<picture>` from a file in src/images (SVGs are copied as-is, hashed, with their width and height).
	 * @param {string} source Path relative to src/images.
	 * @param {string} alt Alternative text; pass "" for decorative images.
	 * @param {string} [sizes] HTML `sizes` attribute.
	 * @returns {Promise<string>} HTML
	 */
	eleventyConfig.addAsyncShortcode("responsiveImage", async (source, alt, sizes = "100vw") => {
		if (alt === undefined) {
			console.warn(`Missing alt text for image: ${source}`);
		}

		// SVGs stay vector (rasterizing logos would blur them and lose transparency in JPEG).
		const isVector = source.toLowerCase().endsWith(".svg");

		const metadata = await Image(`./src/images/${source}`, {
			widths: isVector ? [null] : [400, 800, 1600, null],
			formats: isVector ? ["svg"] : ["avif", "webp", "jpeg"],
			outputDir: "./_site/assets/images/optimized/",
			urlPath: "/assets/images/optimized/",
		});

		return Image.generateHTML(metadata, {
			alt: alt || "",
			sizes,
			loading: "lazy",
			decoding: "async",
		});
	});
}
