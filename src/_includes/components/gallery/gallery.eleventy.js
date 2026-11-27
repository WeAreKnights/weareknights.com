import Image from "@11ty/eleventy-img";
import { escapeHtml } from "../../../../config/helpers/html.js";

const isLocalSource = (source) => !source.startsWith("/") && !/^[a-z]+:/i.test(source);

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

const optimize = async (image, sizes) => {
	const metadata = await Image(`./src/images/${image.src}`, {
		widths: [400, 800, 1600],
		formats: ["avif", "webp", "jpeg"],
		outputDir: "./_site/assets/images/optimized/",
		urlPath: "/assets/images/optimized/",
	});

	const [largest] = metadata.webp.slice(-1);
	const [smallest] = metadata.jpeg;

	return {
		...image,
		full: largest.url,
		width: smallest.width,
		height: smallest.height,
		markup: Image.generateHTML(metadata, { alt: image.alt, sizes, loading: "lazy", decoding: "async" }),
	};
};

const frameIcons = {
	like: '<path d="M12 21s-7-4.4-9.3-9C1.2 8.8 3 5.5 6.2 5.5c1.9 0 3.2 1 3.8 2.1h4c.6-1.1 1.9-2.1 3.8-2.1C21 5.5 22.8 8.8 21.3 12c-2.3 4.6-9.3 9-9.3 9z"/>',
	comment: '<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5A8.5 8.5 0 1 1 21 11.5z"/>',
	share: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7z"/>',
	save: '<path d="M6 3h12v18l-6-4.5L6 21V3z"/>',
};

const renderIcon = (name) =>
	`<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true" focusable="false">${frameIcons[name]}</svg>`;

const renderFrame = (frame, count) => {
	const handle = escapeHtml(frame.handle ?? "");
	const initial = escapeHtml(String(frame.handle ?? "?").replace(/^@/, "").charAt(0).toUpperCase());
	const caption = frame.caption ? `<p class="gallery-frame-caption"><strong>${handle}</strong> ${escapeHtml(frame.caption)}</p>` : "";
	const dots = count > 1 ? `<span class="gallery-frame-dots" aria-hidden="true"><span class="gallery-frame-dot is-active"></span>${'<span class="gallery-frame-dot"></span>'.repeat(count - 1)}</span>` : "";

	const title = frame.title ? `<span class="gallery-frame-title">${escapeHtml(frame.title)}</span>` : "";
	const header = `<header class="gallery-frame-header"><span class="gallery-frame-avatar" aria-hidden="true">${initial}</span><span class="gallery-frame-name"><span class="gallery-frame-handle">${handle}</span>${title}</span></header>`;
	const footer = `<footer class="gallery-frame-footer"><span class="gallery-frame-actions" aria-hidden="true">${renderIcon("like")}${renderIcon("comment")}${renderIcon("share")}<span class="gallery-frame-save">${renderIcon("save")}</span></span>${dots}${caption}</footer>`;

	return { header, footer };
};

export default function (eleventyConfig) {
	/**
	 * Image grid whose thumbnails open in a lightbox. Optionally wrapped in a social frame: a single post (swipeable carousel) or a profile grid.
	 * @param {Array<string | { src: string, alt?: string, caption?: string, width?: number, height?: number }>} images A path relative to src/images is optimized into responsive thumbnails and a large lightbox version. A path starting with "/" or a URL is used as-is, and its dimensions are read from the file when omitted.
	 * @param {number} [columns]
	 * @param {boolean} [masonry] Stack images in columns instead of a uniform grid.
	 * @param {{ type: "instagram" | "instagram-grid", handle: string, title?: string, caption?: string }} [frame] Wraps the gallery in a social frame.
	 * @param {string} [label] Used to write alt text for images given without any.
	 * @returns {Promise<string>} HTML
	 */
	eleventyConfig.addAsyncShortcode("gallery", async (images, columns, masonry, frame, label = "Gallery image") => {
		const columnCount = columns ?? 3;
		const useMasonry = Boolean(masonry) && !frame;
		const isProfileGrid = frame?.type === "instagram-grid";

		const normalized = images.map((image, index) => {
			const entry = typeof image === "string" ? { src: image } : { ...image };
			entry.alt ??= `${label} (${index + 1} of ${images.length})`;
			return entry;
		});

		const sizes = isProfileGrid ? `(min-width: 30rem) ${Math.round(30 / columnCount)}rem, ${Math.round(100 / columnCount)}vw` : frame ? "(min-width: 30rem) 30rem, 100vw" : `(max-width: 640px) 100vw, ${Math.round(100 / columnCount)}vw`;

		const resolved = await Promise.all(
			normalized.map((image) => {
				if (isLocalSource(image.src)) return optimize(image, sizes);
				return useMasonry ? getDimensions(image) : image;
			})
		);

		const thumbnails = resolved
			.map((image, index) => {
				const size = image.width && image.height ? ` width="${image.width}" height="${image.height}"` : "";
				const picture = image.markup ?? `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}"${size} loading="lazy">`;
				const caption = image.caption ? ` data-caption="${escapeHtml(image.caption)}"` : "";

				return `
	<button type="button" class="gallery-item" style="--reveal-index: ${index}" data-src="${escapeHtml(image.full ?? image.src)}" data-alt="${escapeHtml(image.alt)}"${caption}>
		${picture}
	</button>`;
			})
			.join("");

		const modifier = useMasonry ? " gallery-masonry" : isProfileGrid ? " gallery-profile" : frame ? " gallery-framed" : "";

		const gallery = `<div class="gallery${modifier}" style="--gallery-columns: ${columnCount}">${thumbnails}</div>
<dialog class="lightbox">
	<button type="button" class="lightbox-close" aria-label="Close">&times;</button>
	<button type="button" class="lightbox-previous" aria-label="Previous image">&lsaquo;</button>
	<figure class="lightbox-figure">
		<img class="lightbox-image" alt="">
		<figcaption class="lightbox-caption"></figcaption>
	</figure>
	<button type="button" class="lightbox-next" aria-label="Next image">&rsaquo;</button>
</dialog>`;

		if (!frame) return gallery;

		if (frame.type !== "instagram" && !isProfileGrid) {
			console.warn(`Unknown gallery frame type: ${frame.type}`);
			return gallery;
		}

		const { header, footer } = renderFrame(frame, resolved.length);

		if (isProfileGrid) return `<figure class="gallery-frame gallery-frame-instagram-grid">${header}${gallery}</figure>`;

		return `<figure class="gallery-frame gallery-frame-instagram">${header}${gallery}${footer}</figure>`;
	});
}
