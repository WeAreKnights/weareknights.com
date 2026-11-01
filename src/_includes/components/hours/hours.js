// Marks today's row in the opening-hours list and writes the "Open from X to Y today." summary, using the business time zone rather than the visitor's.

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const todayIn = (timeZone) => {
	try {
		return new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: timeZone || undefined });
	} catch {
		return dayNames[new Date().getDay()];
	}
};

document.querySelectorAll("[data-hours]").forEach((hours) => {
	const row = hours.querySelector(`[data-day="${todayIn(hours.dataset.timezone)}"]`);
	if (!row) return;

	row.setAttribute("aria-current", "date");
	hours.querySelector("summary").textContent = row.dataset.open
		? `Open from ${row.dataset.open} today.`
		: "Closed today.";
});
