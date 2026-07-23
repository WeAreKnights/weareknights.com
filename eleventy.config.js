import { IdAttributePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(IdAttributePlugin);

  // Static passthrough
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy({ "node_modules/open-props/open-props.min.css": "css/open-props.min.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/open-props/normalize.min.css": "css/open-props.normalize.min.css" });
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
    strictFilters: false,
  });

  // Date formatting filter used throughout blog templates.
  // timeZone: "UTC" keeps date-only front matter values (parsed as UTC
  // midnight) from displaying as the previous day in negative UTC offsets.
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Look up an author's full record from src/_data/authors.json by id
  // Usage: {{ authors | getAuthor: post_author }}
  eleventyConfig.addFilter("getAuthor", (authors, authorId) => {
    return (authors || []).find((author) => author.id === authorId);
  });

  // Blog posts collection, newest first
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => b.date - a.date);
  });

  // Unique, sorted list of every category used across blog posts
  eleventyConfig.addCollection("categoryList", (collectionApi) => {
    const categories = new Set();
    collectionApi.getFilteredByGlob("src/blog/*.md").forEach((post) => {
      (post.data.categories || []).forEach((category) => categories.add(category));
    });
    return [...categories].sort();
  });

  // Unique, sorted list of every tag used across blog posts (excluding the
  // implicit "posts" tag used to build the collection itself)
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    collectionApi.getFilteredByGlob("src/blog/*.md").forEach((post) => {
      (post.data.tags || []).forEach((tag) => {
        if (tag !== "posts") tags.add(tag);
      });
    });
    return [...tags].sort();
  });

  // Portfolio projects collection
  eleventyConfig.addCollection("portfolio", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/portfolio/*.md").sort((a, b) => {
      return (a.data.order ?? 0) - (b.data.order ?? 0);
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["liquid", "md", "html"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
}
