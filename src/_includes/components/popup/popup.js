// Opens `<dialog>` popups: automatic ones on first scroll (and not again for a day after dismissal), manual ones from `[data-popup-open]` triggers.

const dismissalDurationMilliseconds = 24 * 60 * 60 * 1000;

// Storage can throw (private windows, blocked site data); the popup still works without it.
const readDismissedAt = (key) => {
	try {
		return Number(localStorage.getItem(key));
	} catch {
		return 0;
	}
};

const rememberDismissal = (key) => {
	try {
		localStorage.setItem(key, Date.now().toString());
	} catch {}
};

document.querySelectorAll(".popup").forEach((popup) => {
	// Manual popups open only from a [data-popup-open] trigger; automatic ones open on first scroll and stay dismissed for a day.
	const isAutomatic = !popup.hasAttribute("data-manual");
	const storageKey = `popup-dismissed-${popup.dataset.id}`;

	const dismiss = () => {
		if (isAutomatic) rememberDismissal(storageKey);
		popup.close();
	};

	popup.querySelector(".popup-close").addEventListener("click", dismiss);

	popup.addEventListener("click", (event) => {
		if (event.target === popup) dismiss();
	});

	if (!isAutomatic) return;

	popup.addEventListener("cancel", () => rememberDismissal(storageKey));

	const dismissedAt = readDismissedAt(storageKey);
	if (dismissedAt && Date.now() - dismissedAt < dismissalDurationMilliseconds) return;

	window.addEventListener("scroll", () => popup.showModal(), { once: true, passive: true });
});

document.querySelectorAll("[data-popup-open]").forEach((trigger) => {
	trigger.addEventListener("click", () => {
		const popup = document.querySelector(`.popup[data-id="${CSS.escape(trigger.dataset.popupOpen)}"]`);
		if (!popup || popup.open) return;
		popup.showModal();
		popup.querySelector("input")?.focus();
	});
});
