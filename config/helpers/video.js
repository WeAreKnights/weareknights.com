// Turns a YouTube or Vimeo link into an embed URL with the requested player options.

/**
 * @param {string} url YouTube or Vimeo link.
 * @param {{ autoplay?: boolean, muted?: boolean, loop?: boolean, hideControls?: boolean }} [options]
 * @returns {string} Embed URL; the input unchanged if unrecognised, or an empty string if empty
 */
export function buildVideoEmbedUrl(url, { autoplay = false, muted = false, loop = false, hideControls = false } = {}) {
	if (!url) return "";

	const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
	if (youtubeMatch) {
		const id = youtubeMatch[1];
		const queryParameters = new URLSearchParams();
		if (autoplay) queryParameters.set("autoplay", "1");
		if (muted) queryParameters.set("mute", "1");
		if (loop) {
			queryParameters.set("loop", "1");
			queryParameters.set("playlist", id);
		}
		if (hideControls) {
			queryParameters.set("controls", "0");
			queryParameters.set("showinfo", "0");
			queryParameters.set("rel", "0");
			queryParameters.set("modestbranding", "1");
		}
		if (autoplay) queryParameters.set("playsinline", "1");
		const query = queryParameters.toString();
		return `https://www.youtube.com/embed/${id}${query ? `?${query}` : ""}`;
	}

	const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
	if (vimeoMatch) {
		const id = vimeoMatch[1];
		const queryParameters = new URLSearchParams();
		if (autoplay) queryParameters.set("autoplay", "1");
		if (muted) queryParameters.set("muted", "1");
		if (loop) queryParameters.set("loop", "1");
		if (hideControls) {
			queryParameters.set("background", "1");
			queryParameters.set("controls", "0");
		}
		const query = queryParameters.toString();
		return `https://player.vimeo.com/video/${id}${query ? `?${query}` : ""}`;
	}

	return url;
}
