// Filters portfolio tiles by designer and category via the filter buttons, and preselects filters from ?designer= / ?category= so other pages can deep-link.

const portfolioElements = document.querySelectorAll(".portfolio");
const allValue = "all";

function readQueryValue(key) {
	return new URLSearchParams(window.location.search).get(key);
}

function setPressedButton(group, value) {
	group.querySelectorAll(".portfolio-filter-button").forEach((button) => {
		button.setAttribute("aria-pressed", String(button.dataset.filterValue === value));
	});
}

function setupPortfolio(portfolio) {
	const groups = portfolio.querySelectorAll("[data-filter-group]");
	const tiles = portfolio.querySelectorAll(".portfolio-tile");
	const filters = {};

	function applyFilters() {
		tiles.forEach((tile) => {
			const isMatch = Object.entries(filters).every(([key, value]) => value === allValue || tile.dataset[key] === value);
			tile.hidden = !isMatch;
		});
	}

	groups.forEach((group) => {
		const key = group.dataset.filterGroup;
		const queryValue = readQueryValue(key);
		const hasQueryButton = queryValue && group.querySelector(`.portfolio-filter-button[data-filter-value="${CSS.escape(queryValue)}"]`);

		filters[key] = hasQueryButton ? queryValue : allValue;
		setPressedButton(group, filters[key]);

		group.addEventListener("click", (event) => {
			const button = event.target.closest(".portfolio-filter-button");
			if (!button) return;

			filters[key] = button.dataset.filterValue;
			setPressedButton(group, filters[key]);
			applyFilters();
		});
	});

	applyFilters();
}

portfolioElements.forEach(setupPortfolio);
