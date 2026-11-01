// URL helpers for JSON-LD: absolute URLs and the publisher logo (schema.org needs a raster image, so SVG logos fall back to a generated PNG).

/**
 * @param {string} siteUrl Site origin, e.g. "https://example.com".
 * @param {string} [path] Path or full URL.
 * @returns {string | undefined} Absolute URL, or undefined when there is no path
 */
export function toAbsoluteUrl(siteUrl, path) {
	if (!path) return undefined;
	if (/^https?:\/\//.test(path)) return path;
	return new URL(path, siteUrl).toString();
}

export const publisherLogoPath = "/assets/images/publisher-logo.png";

/**
 * @param {string} [logo] Logo path or URL.
 * @returns {string | undefined} The logo, or the generated PNG when it is an SVG
 */
export function resolvePublisherLogo(logo) {
	if (!logo) return undefined;
	return /\.svg(\?.*)?$/i.test(logo) ? publisherLogoPath : logo;
}
