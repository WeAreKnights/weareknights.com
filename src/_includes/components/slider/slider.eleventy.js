import { escapeHtml } from "../../../../config/helpers/html.js";
export default function (eleventyConfig) {
	/**
	 * Scroll-snapping carousel; controls are added by slider.js.
	 * @param {string} innerHtml The slides, as direct children.
	 * @param {number} [columns] Slides visible at once on desktop.
	 * @param {boolean | number} [autoplay] true is 5 seconds; a number is that many seconds; false is off.
	 * @param {string} [label] Accessible name of the carousel.
	 * @param {boolean} [dots] Show page dots.
	 * @returns {string} HTML
	 */
	eleventyConfig.addPairedShortcode("slider", (innerHtml, columns = 3, autoplay = false, label = "Slides", dots = true) => {
		const seconds = autoplay === true ? 5 : Number(autoplay);
		const autoplayAttribute = seconds > 0 ? ` data-autoplay="${seconds * 1000}"` : "";
		const dotsAttribute = dots === false ? ' data-dots="false"' : "";

		return `
<div class="slider" role="group" aria-roledescription="carousel" aria-label="${escapeHtml(label)}" style="--slider-columns: ${Number(columns) || 3}"${autoplayAttribute}${dotsAttribute}>
	<div class="slider-track">
		${innerHtml}
	</div>
</div>`;
	});
}
