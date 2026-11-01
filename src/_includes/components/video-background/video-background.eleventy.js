import { buildVideoEmbedUrl } from "../../../../config/helpers/video.js";
import { escapeHtml } from "../../../../config/helpers/html.js";

export default function (eleventyConfig) {
	/**
	 * Muted, looping video behind the wrapped content.
	 * @param {string} innerHtml Content shown over the video.
	 * @param {string} url YouTube or Vimeo link.
	 * @returns {string} HTML; the content alone when the URL isn't recognised
	 */
	eleventyConfig.addPairedShortcode("videoBackground", (innerHtml, url) => {
		const embedUrl = buildVideoEmbedUrl(url, { autoplay: true, muted: true, loop: true, hideControls: true });
		if (!embedUrl) return innerHtml;

		return `
<div class="video-section">
	<div class="video-background" aria-hidden="true">
		<iframe src="${escapeHtml(embedUrl)}" title="Background video" tabindex="-1" allow="autoplay"></iframe>
	</div>
	<div class="video-content">
		${innerHtml}
	</div>
</div>`;
	});
}
