// Eleventy configuration: passthrough files, collections (blog pages, categories, tags), and the modules in config/.

import { readFileSync } from "node:fs";
import addFilters from "./config/filters.js";
import addShortcodes from "./config/shortcodes.js";
import addSchemaShortcodes from "./config/schema.js";
import addImageShortcode from "./config/image.js";
import addComponents from "./config/components.js";
import { paginateGroupedPosts, filterTagList } from "./config/helpers/posts.js";

const { postsPerPage = 10 } = JSON.parse(readFileSync(new URL("./src/_data/site.json", import.meta.url), "utf8"));

export default async function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
	eleventyConfig.addPassthroughCopy("src/CNAME");
	eleventyConfig.addWatchTarget("_site/assets/.vite/manifest.json");

	eleventyConfig.addCollection("blogPages", (collectionApi) => {
		const posts = [...collectionApi.getFilteredByTag("posts")].reverse();
		return paginateGroupedPosts(posts, () => ["Blog"], postsPerPage);
	});

	eleventyConfig.addCollection("postCategoryPages", (collectionApi) => {
		const posts = [...collectionApi.getFilteredByTag("posts")].reverse();
		return paginateGroupedPosts(posts, (post) => post.data.categories || [], postsPerPage);
	});

	eleventyConfig.addCollection("postTagPages", (collectionApi) => {
		const posts = [...collectionApi.getFilteredByTag("posts")].reverse();
		return paginateGroupedPosts(posts, (post) => filterTagList(post.data.tags), postsPerPage);
	});

	eleventyConfig.addCollection("portfolioProjects", (collectionApi) => {
		return collectionApi.getFilteredByTag("portfolio").sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
	});

	addFilters(eleventyConfig);
	addShortcodes(eleventyConfig);
	addSchemaShortcodes(eleventyConfig);
	addImageShortcode(eleventyConfig);
	await addComponents(eleventyConfig);

	return {
		dir: {
			input: "src",
			includes: "_includes",
			layouts: "_includes/layouts",
			output: "_site",
		},
		templateFormats: ["liquid", "md"],
		htmlTemplateEngine: "liquid",
		markdownTemplateEngine: "liquid",
	};
}
