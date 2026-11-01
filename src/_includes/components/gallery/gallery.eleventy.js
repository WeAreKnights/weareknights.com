import Image from "@11ty/eleventy-img";
import { escapeHtml } from "../../../../config/helpers/html.js";

const getDimensions = async (image) => {
	if (image.width && image.height) return image;

	try {
		const path = image.src.startsWith("/") ? `./src${image.src}` : image.src;
		const metadata = await Image(path, { dryRun: true, formats: [null] });
		const { width, height } = Object.values(metadata)[0][0];
		return { ...image, width, height };
	} catch {
		console.warn(`Could not read dimensions for gallery image: ${image.src}`);
		return image;
	}
};

export default function (eleventyConfig) {
	/**
	 * Image grid whose thumbnails open in a lightbox.
	 * @param {Array<{ src: string, alt: string, width?: number, height?: number }>} images Dimensions are read from the file when omitted.
	 * @param {number} [columns]
	 * @param {boolean} [masonry] Stack images in columns instead of a uniform grid.
	 * @returns {Promise<string>} HTML
	 */
	eleventyConfig.addAsyncShortcode("gallery", async (images, columns = 3, masonry = false) => {
		const resolved = masonry ? await Promise.all(images.map(getDimensions)) : images;

		const thumbnails = resolved
			.map((image, index) => {
				if (image.alt === undefined) {
					console.warn(`Missing alt text for gallery image: ${image.src}`);
				}

				const size = image.width && image.height ? ` width="${image.width}" height="${image.height}"` : "";

				return `
	<button type="button" class="gallery-item" style="--reveal-index: ${index}" data-src="${escapeHtml(image.src)}" data-alt="${escapeHtml(image.alt)}">
		<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}"${size} loading="lazy">
	</button>`;
			})
			.join("");

		const modifier = masonry ? " gallery-masonry" : "";

		return `<div class="gallery${modifier}" style="--gallery-columns: ${columns}">${thumbnails}</div>
<dialog class="lightbox">
	<button type="button" class="lightbox-close" aria-label="Close">&times;</button>
	<button type="button" class="lightbox-previous" aria-label="Previous image">&lsaquo;</button>
	<img class="lightbox-image" alt="">
	<button type="button" class="lightbox-next" aria-label="Next image">&rsaquo;</button>
</dialog>`;
	});
}
