import { buildVideoEmbedUrl } from "../../../../config/helpers/video.js";
import { escapeHtml } from "../../../../config/helpers/html.js";

export default function (eleventyConfig) {
	/**
	 * Responsive YouTube or Vimeo embed.
	 * @param {string} url YouTube or Vimeo link.
	 * @param {boolean} [autoplayOnScroll] Start playing when the video scrolls into view.
	 * @returns {string} HTML
	 */
	eleventyConfig.addShortcode("video", (url, autoplayOnScroll = false) => {
		if (!autoplayOnScroll) {
			const embedUrl = buildVideoEmbedUrl(url);
			if (!embedUrl) return "";
			return `<div class="video-embed"><iframe src="${escapeHtml(embedUrl)}" title="Video" allow="fullscreen" allowfullscreen></iframe></div>`;
		}

		const embedUrl = buildVideoEmbedUrl(url, { autoplay: true, muted: true });
		if (!embedUrl) return "";
		return `<div class="video-embed" data-video-autoplay data-src="${escapeHtml(embedUrl)}"><iframe title="Video" allow="fullscreen; autoplay" allowfullscreen></iframe></div>`;
	});
}
