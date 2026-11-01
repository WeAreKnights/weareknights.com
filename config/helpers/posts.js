// Blog helpers: hide reserved tags and split posts into per-category/tag pages.

const reservedTags = ["posts"];

/**
 * @param {string[]} [tags]
 * @returns {string[]} The tags without reserved ones such as "posts"
 */
export function filterTagList(tags) {
	return (tags || []).filter((tag) => !reservedTags.includes(tag));
}

/**
 * Groups posts by term (category or tag) and splits each group into pages.
 * @param {object[]} posts
 * @param {(post: object) => string[]} getTerms Returns the terms a post belongs to.
 * @param {number} [size] Posts per page.
 * @returns {Array<{ term: string, posts: object[], pageNumber: number, totalPages: number }>} pageNumber is 0-based
 */
export function paginateGroupedPosts(posts, getTerms, size = 10) {
	const grouped = new Map();

	posts.forEach((post) => {
		getTerms(post).forEach((term) => {
			if (!grouped.has(term)) grouped.set(term, []);
			grouped.get(term).push(post);
		});
	});

	const pages = [];
	[...grouped.keys()].sort().forEach((term) => {
		const termPosts = grouped.get(term);
		const totalPages = Math.ceil(termPosts.length / size);
		for (let pageNumber = 0; pageNumber < totalPages; pageNumber++) {
			pages.push({
				term,
				posts: termPosts.slice(pageNumber * size, pageNumber * size + size),
				pageNumber,
				totalPages,
			});
		}
	});

	return pages;
}
