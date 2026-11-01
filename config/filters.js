// Eleventy filters (dates, addresses, URLs, video embeds, tags).

import { formatAddress } from "./helpers/data.js";
import { relativeDate } from "./helpers/dates.js";
import { toAbsoluteUrl } from "./helpers/urls.js";
import { buildVideoEmbedUrl } from "./helpers/video.js";
import { filterTagList } from "./helpers/posts.js";

export default function (eleventyConfig) {
	eleventyConfig.addFilter("isoDate", (dateObject) => dateObject.toISOString().split("T")[0]);

	eleventyConfig.addFilter("readableDate", (dateObject) =>
		new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(dateObject)
	);

	eleventyConfig.addFilter("formatAddress", formatAddress);

	eleventyConfig.addFilter("relativeDate", relativeDate);

	eleventyConfig.addFilter("videoEmbedUrl", (url, background = false) =>
		buildVideoEmbedUrl(url, background ? { autoplay: true, muted: true, loop: true, hideControls: true } : {})
	);

	eleventyConfig.addFilter("absoluteUrl", (path, siteUrl) => toAbsoluteUrl(siteUrl, path));

	eleventyConfig.addFilter("filterTagList", filterTagList);
}
