import { escapeHtml } from "../../../../config/helpers/html.js";

export default function (eleventyConfig) {
	/**
	 * Contact form wrapper with spam checks around the caller's fields.
	 * @param {string} innerHtml The form fields, written between the shortcode tags.
	 * @param {string} [to] Recipient address passed to the mail handler; omitted to use its default.
	 * @param {string} [action] URL of the mail handler.
	 * @returns {string} HTML
	 */
	eleventyConfig.addPairedShortcode("form", (innerHtml, to, action = "/api/contact.php") => {
		const toField = to ? `<input type="hidden" name="to" value="${escapeHtml(to)}">` : "";

		return `
<form class="form" method="POST" action="${escapeHtml(action)}" novalidate data-form>
	${toField}
	<input type="hidden" name="timestamp" value="">
	<p class="visually-hidden">
		<label for="form-website">Leave this field blank</label>
		<input id="form-website" name="website" type="text" tabindex="-1" autocomplete="off">
	</p>
	${innerHtml}
	<fieldset class="form-human">
		<legend class="pill">Are you human?</legend>
		<label for="form-math-answer" data-form-math-label>Solve the math problem</label>
		<input id="form-math-answer" name="mathAnswer" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off" required>
		<input type="hidden" name="mathA" value="">
		<input type="hidden" name="mathB" value="">
	</fieldset>
	<button class="button" type="submit">Send</button>
	<p class="form-status" data-form-status role="status" aria-live="polite"></p>
</form>`;
	});
}
