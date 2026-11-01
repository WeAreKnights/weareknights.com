// Formats a date as relative text such as "3 days ago".

/**
 * @param {Date} dateObject
 * @returns {string} English relative text such as "3 days ago" or "in 2 hours"
 */
export function relativeDate(dateObject) {
	const diffSeconds = Math.round((dateObject.getTime() - Date.now()) / 1000);
	const units = [
		["year", 60 * 60 * 24 * 365],
		["month", 60 * 60 * 24 * 30],
		["day", 60 * 60 * 24],
		["hour", 60 * 60],
		["minute", 60],
	];

	const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

	for (const [unit, secondsInUnit] of units) {
		if (Math.abs(diffSeconds) >= secondsInUnit) {
			return formatter.format(Math.round(diffSeconds / secondsInUnit), unit);
		}
	}

	return formatter.format(diffSeconds, "second");
}
