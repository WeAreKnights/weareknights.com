import { escapeHtml } from "../../../../config/helpers/html.js";

export default function (eleventyConfig) {
	/**
	 * Previous/next links and numbered page links; renders nothing when there is only one page.
	 * @param {number} currentPage 1-based number of the page being shown.
	 * @param {number} totalPages
	 * @param {string} basePath URL path without a trailing slash, e.g. "/blog".
	 * @param {string} [label] Accessible name of the navigation.
	 * @returns {string} HTML
	 */
	eleventyConfig.addShortcode("pagination", (currentPage, totalPages, basePath, label = "Pagination") => {
		currentPage = Number(currentPage);
		totalPages = Number(totalPages);
		if (!(totalPages > 1)) return "";

		const href = (page) => escapeHtml(page === 1 ? `${basePath}/` : `${basePath}/page/${page}/`);

		const shown = [];
		for (let page = 1; page <= totalPages; page++) {
			if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) shown.push(page);
		}

		const items = shown
			.flatMap((page, index) => {
				const gap = index ? page - shown[index - 1] : 0;
				if (gap === 2) return [page - 1, page];
				return gap > 2 ? ["gap", page] : [page];
			})
			.map((page) => {
				if (page === "gap") return `<li aria-hidden="true">&hellip;</li>`;
				const isCurrent = page === currentPage;
				return `<li><a href="${href(page)}"${isCurrent ? ' aria-current="page"' : ""} aria-label="Page ${page}">${page}</a></li>`;
			})
			.join("\n\t\t");

		const previous = currentPage > 1 ? `<a class="pagination-previous" href="${href(currentPage - 1)}" rel="prev">Previous</a>` : "";
		const next = currentPage < totalPages ? `<a class="pagination-next" href="${href(currentPage + 1)}" rel="next">Next</a>` : "";

		return `<nav class="pagination" aria-label="${escapeHtml(label)}">
	${previous}
	<ol>
		${items}
	</ol>
	${next}
</nav>`;
	});
}
