export default function (eleventyConfig) {
	eleventyConfig.addShortcode(
		"search",
		() => `<div class="search" data-search>
	<noscript>Search requires JavaScript.</noscript>
</div>`
	);
}
