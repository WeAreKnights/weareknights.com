const allowedTabs = ["timeline", "events", "messages"];

export default function (eleventyConfig) {
	/**
	 * Facebook Page plugin, loaded lazily by facebook-embed.js.
	 * @param {string} url Facebook Page URL.
	 * @param {string} [tabs] Plugin tabs, e.g. "timeline" or "timeline,events".
	 * @param {number} [height] Frame height in pixels.
	 * @param {boolean} [compact] Use the small header and hide the cover photo.
	 * @param {boolean} [facepile] Show the faces of people who like the Page.
	 * @returns {string} HTML
	 */
	eleventyConfig.addShortcode("facebookEmbed", (url, tabs = "timeline", height = 500, compact = false, facepile = true) => {
		let pageUrl;

		try {
			pageUrl = new URL(url);
		} catch {
			console.warn(`Invalid Facebook Page URL: ${url}`);
			return "";
		}

		if (!/^(www\.)?facebook\.com$/.test(pageUrl.hostname)) {
			console.warn(`Not a Facebook Page URL: ${url}`);
			return "";
		}

		const selectedTabs = String(tabs)
			.split(",")
			.map((tab) => tab.trim())
			.filter((tab) => allowedTabs.includes(tab))
			.join(",");

		const frameHeight = Number(height) || 500;

		return `<div class="facebook-embed" data-facebook-embed data-href="${pageUrl.href}" data-tabs="${selectedTabs}" data-height="${frameHeight}" data-compact="${compact === true}" data-facepile="${facepile !== false}">
	<div class="facebook-embed-frame" style="--facebook-embed-height: ${frameHeight}px"></div>
	<p class="facebook-embed-fallback">
		<a href="${pageUrl.href}" target="_blank" rel="noopener noreferrer">View our Facebook Page<span class="visually-hidden"> (opens in a new tab)</span></a>
	</p>
</div>`;
	});
}
