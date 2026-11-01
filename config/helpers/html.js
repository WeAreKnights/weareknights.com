// HTML and JSON escaping helpers shared by shortcodes and schema output.

/**
 * @param {unknown} value
 * @returns {string} Safe for element text and quoted attributes
 */
export function escapeHtml(value) {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

// JSON.stringify for inline <script type="application/ld+json">: "<" is escaped so text containing "</script>" can't end the block early.
export function jsonForScript(value) {
	return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * @param {string} html
 * @returns {string} Text with tags removed and whitespace collapsed
 */
export function stripTags(html) {
	return html
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}
