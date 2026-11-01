import { setPageReviews } from "../../../../config/schema.js";
import { escapeHtml } from "../../../../config/helpers/html.js";

export default function (eleventyConfig) {
	/**
	 * Review cards; also registers the reviews so schema.js adds them to the page's LocalBusiness JSON-LD.
	 * @param {Array<{ name: string, rating: number, review: string, source: string }>} reviews
	 * @returns {string} HTML, or an empty string when there are no reviews
	 */
	eleventyConfig.addShortcode("reviews", function (reviews) {
		if (!Array.isArray(reviews) || !reviews.length) return "";

		setPageReviews(this.page.url, reviews);

		const cards = reviews
			.map((review, index) => {
				const rating = Math.max(0, Math.min(5, Math.round(review.rating)));
				const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
				const textId = `review-text-${index}`;

				return `
	<li class="review">
		<div class="review-rating" aria-label="${rating} out of 5 stars">${stars}</div>
		<p class="review-text" id="${textId}" data-review-text>${escapeHtml(review.review)}</p>
		<button type="button" class="review-toggle" data-review-toggle aria-controls="${textId}" aria-expanded="false" hidden>Read more</button>
		<p class="review-meta"><strong>${escapeHtml(review.name)}</strong> via ${escapeHtml(review.source)}</p>
	</li>`;
			})
			.join("");

		return `<ul class="reviews">${cards}</ul>`;
	});
}
