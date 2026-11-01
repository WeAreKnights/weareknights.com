// Shows a "Read more" toggle on review text only when the text is clamped (overflows its box).

document.querySelectorAll("[data-review-text]").forEach((text) => {
	const toggle = text.nextElementSibling;
	if (!toggle || !toggle.hasAttribute("data-review-toggle")) return;

	if (text.scrollHeight <= text.clientHeight + 1) return;

	toggle.hidden = false;
	toggle.addEventListener("click", () => {
		const expanded = text.classList.toggle("is-expanded");
		toggle.textContent = expanded ? "Read less" : "Read more";
		toggle.setAttribute("aria-expanded", String(expanded));
	});
});
