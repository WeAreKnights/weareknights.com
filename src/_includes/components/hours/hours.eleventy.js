import { escapeHtml } from "../../../../config/helpers/html.js";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const formatTime = (value) => {
	const [hours, minutes] = value.split(":").map(Number);
	const suffix = hours >= 12 ? "pm" : "am";
	const hour = hours % 12 || 12;
	return minutes ? `${hour}:${String(minutes).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
};

export default function (eleventyConfig) {
	/**
	 * Opening hours as an accordion; hours.js fills the "Open from X to Y today." summary.
	 * @param {Array<{ dayOfWeek: string | string[], opens: string, closes: string }>} [openingHours] schema.org-style entries, times as "HH:MM".
	 * @param {string} [timeZone] IANA time zone of the business, e.g. "America/New_York", used to decide what "today" is.
	 * @returns {string} HTML, or an empty string when there are no hours
	 */
	eleventyConfig.addShortcode("hours", (openingHours = [], timeZone = "") => {
		if (!Array.isArray(openingHours) || !openingHours.length) return "";

		const ranges = Object.fromEntries(days.map((day) => [day, []]));

		openingHours.forEach(({ dayOfWeek = [], opens, closes }) => {
			if (!opens || !closes) return;
			[].concat(dayOfWeek).forEach((name) => {
				const day = String(name).replace(/^.*\//, "");
				if (ranges[day]) ranges[day].push(`${formatTime(opens)} to ${formatTime(closes)}`);
			});
		});

		const rows = days
			.map((day) => {
				const text = ranges[day].join(" and ");
				return `<tr data-day="${day}" data-open="${text}"><th scope="row">${day}</th><td>${text || "Closed"}</td></tr>`;
			})
			.join("\n\t\t\t");

		return `<details class="hours" data-hours data-timezone="${escapeHtml(timeZone)}">
	<summary>Opening hours</summary>
	<table>
		<tbody>
			${rows}
		</tbody>
	</table>
</details>`;
	});
}
