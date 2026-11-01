import { escapeHtml } from "../../../../config/helpers/html.js";

export default function (eleventyConfig) {
	/**
	 * A `<dialog>` popup; behaviour in popup.js.
	 * @param {string} innerHtml Popup content.
	 * @param {string} [id] Unique name; opened by any `[data-popup-open="id"]` element.
	 * @param {boolean} [auto] true opens on first scroll (then stays dismissed for a day); false opens only from a trigger.
	 * @param {string} [label] Accessible name of the dialog.
	 * @returns {string} HTML
	 */
	eleventyConfig.addPairedShortcode("popup", (innerHtml, id = "popup", auto = true, label = "") => {
		const manual = auto === false ? " data-manual" : "";
		const ariaLabel = label ? ` aria-label="${escapeHtml(label)}"` : "";

		return `
<dialog class="popup" data-id="${escapeHtml(id)}"${manual}${ariaLabel}>
	<button type="button" class="popup-close" aria-label="Close">&times;</button>
	${innerHtml}
</dialog>`;
	});
}
