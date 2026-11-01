import { escapeHtml } from "../../../../config/helpers/html.js";

const networks = [
	{
		key: "facebook",
		label: "Facebook",
		icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" fill="currentColor"/></svg>',
	},
	{
		key: "instagram",
		label: "Instagram",
		icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c-2.7 0-3.1 0-4.1.1-1.1.1-1.8.2-2.4.5-.7.3-1.2.6-1.8 1.2C3.2 4.4 2.9 4.9 2.6 5.6c-.3.6-.5 1.3-.5 2.4C2 9 2 9.4 2 12s0 3.1.1 4.1c.1 1.1.2 1.8.5 2.4.3.7.6 1.2 1.2 1.8.6.6 1.1.9 1.8 1.2.6.3 1.3.5 2.4.5C8.9 22 9.3 22 12 22s3.1 0 4.1-.1c1.1-.1 1.8-.2 2.4-.5.7-.3 1.2-.6 1.8-1.2.6-.6.9-1.1 1.2-1.8.3-.6.5-1.3.5-2.4.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c-.1-1.1-.2-1.8-.5-2.4-.3-.7-.6-1.2-1.2-1.8-.6-.6-1.1-.9-1.8-1.2-.6-.3-1.3-.4-2.4-.5C15.1 2 14.7 2 12 2Zm0 1.8c2.6 0 3 0 4 .1 1 .1 1.5.2 1.8.3.5.2.8.4 1.1.7.3.3.6.6.7 1.1.1.3.3.8.3 1.8.1 1 .1 1.4.1 4s0 3-.1 4c-.1 1-.2 1.5-.3 1.8-.2.5-.4.8-.7 1.1-.3.3-.6.6-1.1.7-.3.1-.8.3-1.8.3-1 .1-1.4.1-4 .1s-3 0-4-.1c-1-.1-1.5-.2-1.8-.3-.5-.2-.8-.4-1.1-.7-.3-.3-.6-.6-.7-1.1-.1-.3-.3-.8-.3-1.8-.1-1-.1-1.4-.1-4s0-3 .1-4c.1-1 .2-1.5.3-1.8.2-.5.4-.8.7-1.1.3-.3.6-.6 1.1-.7.3-.1.8-.3 1.8-.3 1-.1 1.4-.1 4-.1Zm0 3.2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" fill="currentColor"/></svg>',
	},
	{
		key: "x",
		label: "X",
		icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 3H21l-6.6 7.5L22 21h-6.5l-4.6-6-5.3 6H3l7.1-8-7.6-9.5h6.6l4.2 5.5L18.9 3Zm-1.1 16h1.7L7.3 4.8H5.5L17.8 19Z" fill="currentColor"/></svg>',
	},
	{
		key: "linkedin",
		label: "LinkedIn",
		icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.98h4v10.02H3V9.98Zm6.5 0h3.8v1.4h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6v5.5h-4v-4.9c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6v5h-4V9.98Z" fill="currentColor"/></svg>',
	},
	{
		key: "youtube",
		label: "YouTube",
		icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22.5 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C16.4 3.6 12 3.6 12 3.6h0s-4.4 0-7.3.3c-.5.1-1.5.1-2.3 1-.7.7-.9 2.3-.9 2.3S1.2 9 1.2 10.9v1.9c0 1.9.3 3.7.3 3.7s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.1.3 7.1.3s4.4 0 7.3-.3c.5-.1 1.5-.1 2.3-1 .7-.7.9-2.3.9-2.3s.3-1.9.3-3.7v-1.9c0-1.9-.3-3.7-.3-3.7ZM9.9 15.3V8.9l6.1 3.2-6.1 3.2Z" fill="currentColor"/></svg>',
	},
];

export default function (eleventyConfig) {
	/**
	 * Links to the social networks that have a URL.
	 * @param {Record<string, string>} social Network key to profile URL, e.g. site.social.
	 * @param {boolean} [showLabel] Show the network name beside its icon.
	 * @returns {string} HTML
	 */
	eleventyConfig.addShortcode("social", (social, showLabel = false) => {
		const items = networks
			.filter((network) => social?.[network.key])
			.map(
				(network) => `
	<li>
		<a href="${escapeHtml(social[network.key])}" target="_blank" rel="noopener noreferrer">
			${network.icon}
			<span${showLabel ? "" : ' class="visually-hidden"'}>${network.label}</span>
			<span class="visually-hidden"> (opens in a new tab)</span>
		</a>
	</li>`
			)
			.join("");

		if (!items) return "";

		return `<ul class="social">${items}</ul>`;
	});
}
