// Shortcodes that aren't components, such as `faq`, which also emits FAQPage JSON-LD.

import { jsonForScript, stripTags } from "./helpers/html.js";

export default function (eleventyConfig) {
	/**
	 * Wraps `<details>` questions and emits FAQPage JSON-LD from them.
	 * @param {string} innerHtml `<details><summary>Question</summary>Answer</details>` blocks.
	 * @returns {string} HTML plus a JSON-LD script
	 */
	eleventyConfig.addPairedShortcode("faq", (innerHtml) => {
		const items = [...innerHtml.matchAll(/<details[^>]*>[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map(
			([, question, answer]) => ({
				question: stripTags(question),
				answer: stripTags(answer),
			})
		);

		const schema = items.length
			? {
					"@context": "https://schema.org",
					"@type": "FAQPage",
					mainEntity: items.map((item) => ({
						"@type": "Question",
						name: item.question,
						acceptedAnswer: {
							"@type": "Answer",
							text: item.answer,
						},
					})),
			  }
			: undefined;

		const schemaScript = schema ? `<script type="application/ld+json">${jsonForScript(schema)}</script>` : "";

		return `${innerHtml}${schemaScript}`;
	});
}
