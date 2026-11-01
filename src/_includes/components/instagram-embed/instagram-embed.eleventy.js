export default function (eleventyConfig) {
	/**
	 * Instagram profile or post in an iframe.
	 * @param {string} url Instagram profile or post URL.
	 * @param {number} [height] Frame height in pixels.
	 * @returns {string} HTML
	 */
	eleventyConfig.addShortcode("instagramEmbed", (url, height = 500) => {
		let instagramUrl;

		try {
			instagramUrl = new URL(url);
		} catch {
			console.warn(`Invalid Instagram URL: ${url}`);
			return "";
		}

		if (!/^(www\.)?instagram\.com$/.test(instagramUrl.hostname)) {
			console.warn(`Not an Instagram URL: ${url}`);
			return "";
		}

		const segments = instagramUrl.pathname.split("/").filter(Boolean);
		const isContent = ["p", "reel", "tv"].includes(segments[0]);

		if (!segments.length) {
			console.warn(`Instagram URL is missing a profile or post: ${url}`);
			return "";
		}

		const path = isContent ? segments.slice(0, 2) : segments.slice(0, 1);
		const canonicalUrl = `https://www.instagram.com/${path.join("/")}/`;
		const label = isContent ? "View this post on Instagram" : `View @${segments[0]} on Instagram`;

		return `<div class="instagram-embed">
	<iframe src="${canonicalUrl}embed" title="${isContent ? "Instagram post" : "Instagram profile"}" height="${Number(height) || 500}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowtransparency="true"></iframe>
	<p class="instagram-embed-fallback">
		<a href="${canonicalUrl}" target="_blank" rel="noopener noreferrer">${label}<span class="visually-hidden"> (opens in a new tab)</span></a>
	</p>
</div>`;
	});
}
