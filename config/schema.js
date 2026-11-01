// JSON-LD output: LocalBusiness, BlogPosting and breadcrumbs, with page reviews merged into the single LocalBusiness node.

import { omitEmpty } from "./helpers/data.js";
import { jsonForScript } from "./helpers/html.js";
import { toAbsoluteUrl, resolvePublisherLogo } from "./helpers/urls.js";

// Reviews rendered by {% reviews %} are merged into the page's single LocalBusiness node (below) instead of
// being emitted as a second node with the same @id. Keyed by page.url like the sidebar content.
const pageReviews = new Map();

/**
 * Remembers the reviews rendered on a page so its LocalBusiness JSON-LD can include them.
 * @param {string} url Page URL path.
 * @param {Array<{ name: string, rating: number, review: string, source: string }>} reviews
 */
export function setPageReviews(url, reviews) {
	pageReviews.set(url, reviews);
}

function reviewFields(reviews) {
	if (!reviews?.length) return {};

	const averageRating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;

	return {
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: Math.round(averageRating * 10) / 10,
			reviewCount: reviews.length,
		},
		review: reviews.map((review) => ({
			"@type": "Review",
			author: { "@type": "Person", name: review.name },
			reviewRating: { "@type": "Rating", ratingValue: review.rating },
			reviewBody: review.review,
			publisher: { "@type": "Organization", name: review.source },
		})),
	};
}

function breadcrumbSchema(items) {
	return `<script type="application/ld+json">${jsonForScript({
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	})}</script>`;
}

export default function (eleventyConfig) {
	eleventyConfig.on("eleventy.before", () => pageReviews.clear());

	/**
	 * LocalBusiness JSON-LD script, including any reviews registered for the page.
	 * @param {object} site The site.json data.
	 * @param {string} title Page title.
	 * @param {string} description Page description.
	 * @param {string} [image] Page image path or URL.
	 * @param {string} url Page URL path.
	 * @returns {string} A JSON-LD script tag
	 */
	eleventyConfig.addShortcode("localBusinessSchema", (site, title, description, image, url) => {
		const business = site.business || {};
		const address = business.address || {};
		const geo = business.geo || {};

		const hasAddress = [address.street, address.city, address.region, address.postalCode].some(Boolean);
		const hasGeo = geo.latitude && geo.longitude;

		const schema = omitEmpty({
			"@context": "https://schema.org",
			"@type": business.type || "LocalBusiness",
			"@id": toAbsoluteUrl(site.url, "/") + "#business",
			name: title || site.title,
			description: description || site.description,
			image: toAbsoluteUrl(site.url, image || site.image),
			url: toAbsoluteUrl(site.url, url),
			telephone: business.telephone,
			email: business.email,
			priceRange: business.priceRange,
			address: hasAddress
				? {
						"@type": "PostalAddress",
						streetAddress: address.street,
						addressLocality: address.city,
						addressRegion: address.region,
						postalCode: address.postalCode,
						addressCountry: address.country,
				  }
				: undefined,
			geo: hasGeo
				? {
						"@type": "GeoCoordinates",
						latitude: geo.latitude,
						longitude: geo.longitude,
				  }
				: undefined,
			openingHoursSpecification: business.openingHours,
			sameAs: Object.values(site.social || {}).filter(Boolean),
			...reviewFields(pageReviews.get(url)),
		});

		return `<script type="application/ld+json">${jsonForScript(schema)}</script>`;
	});

	/**
	 * BlogPosting JSON-LD script.
	 * @param {object} site The site.json data.
	 * @param {string} title
	 * @param {string} description
	 * @param {string} [image] Post image path or URL.
	 * @param {string} url Post URL path.
	 * @param {Date | string} date Publish date.
	 * @param {Date | string} [modified] Last-updated date.
	 * @returns {string} A JSON-LD script tag
	 */
	eleventyConfig.addShortcode("blogPostingSchema", (site, title, description, image, url, date, modified) => {
		const isoDate = (value) => (value ? new Date(value).toISOString().split("T")[0] : undefined);

		const schema = omitEmpty({
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			mainEntityOfPage: { "@type": "WebPage", "@id": toAbsoluteUrl(site.url, url) },
			headline: title || site.title,
			description: description || site.description,
			image: toAbsoluteUrl(site.url, image || site.image),
			datePublished: isoDate(date),
			dateModified: isoDate(modified) || isoDate(date),
			author: { "@type": "Organization", name: site.title, url: toAbsoluteUrl(site.url, "/") },
			publisher: omitEmpty({
				"@type": "Organization",
				name: site.title,
				logo: site.logo ? { "@type": "ImageObject", url: toAbsoluteUrl(site.url, resolvePublisherLogo(site.logo)) } : undefined,
			}),
		});

		return `<script type="application/ld+json">${jsonForScript(schema)}</script>`;
	});

	/**
	 * Breadcrumb JSON-LD for a top-level page: Home, then the page.
	 * @param {object} site The site.json data.
	 * @param {string} title Page title.
	 * @param {string} url Page URL path.
	 * @returns {string} A JSON-LD script tag
	 */
	eleventyConfig.addShortcode("pageBreadcrumbSchema", (site, title, url) =>
		breadcrumbSchema([
			{ name: site.title, url: toAbsoluteUrl(site.url, "/") },
			{ name: title, url: toAbsoluteUrl(site.url, url) },
		])
	);

	/**
	 * Breadcrumb JSON-LD for a blog post: Home, Blog, then the post.
	 * @param {object} site The site.json data.
	 * @param {string} title Post title.
	 * @param {string} url Post URL path.
	 * @returns {string} A JSON-LD script tag
	 */
	eleventyConfig.addShortcode("postBreadcrumbSchema", (site, title, url) =>
		breadcrumbSchema([
			{ name: site.title, url: toAbsoluteUrl(site.url, "/") },
			{ name: "Blog", url: toAbsoluteUrl(site.url, "/blog/") },
			{ name: title, url: toAbsoluteUrl(site.url, url) },
		])
	);
}
