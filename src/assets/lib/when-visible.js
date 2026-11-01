// How far outside the viewport an element counts as "near", so lazy work starts before it is seen.
export const preloadMargin = "200px";

// Runs `callback(element)` once per element, the first time it scrolls near the viewport.
export function whenVisible(elements, callback, options = {}) {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			observer.unobserve(entry.target);
			callback(entry.target);
		});
	}, options);

	elements.forEach((element) => observer.observe(element));
}
