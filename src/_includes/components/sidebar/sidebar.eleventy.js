const sidebars = new Map();

export default function (eleventyConfig) {
	eleventyConfig.on("eleventy.before", () => sidebars.clear());

	/**
	 * Stores this page's sidebar content for the layout to render; outputs nothing in place.
	 * @param {string} innerHtml
	 * @returns {string} Always empty
	 */
	eleventyConfig.addPairedShortcode("sidebar", function (innerHtml) {
		sidebars.set(this.page.url, innerHtml);
		return "";
	});

	eleventyConfig.addFilter("sidebarContent", function () {
		return sidebars.get(this.page.url) || "";
	});
}
