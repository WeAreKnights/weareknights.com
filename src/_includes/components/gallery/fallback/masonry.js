// Masonry for browsers without `display: grid-lanes`. Each image goes into the shortest column in DOM order, the same rule Grid Lanes uses, with the height taken from its width and height attributes so nothing waits on image loading.

export default function masonry(gallery) {
	const items = [...gallery.querySelectorAll(".gallery-item")];
	const ratios = items.map((item) => {
		const image = item.querySelector("img");
		return Number(image.getAttribute("height")) / Number(image.getAttribute("width"));
	});

	if (ratios.some((ratio) => !Number.isFinite(ratio) || ratio <= 0)) return;

	gallery.classList.add("gallery-masonry-fallback");

	const layout = () => {
		items.forEach((item) => {
			item.style.gridColumn = "";
			item.style.gridRow = "";
		});

		const style = getComputedStyle(gallery);
		const tracks = style.gridTemplateColumns.split(" ");
		const columns = tracks.length;
		const columnWidth = parseFloat(tracks[0]);
		const gap = parseFloat(style.columnGap) || 0;
		const heights = new Array(columns).fill(0);

		items.forEach((item, index) => {
			const column = heights.indexOf(Math.min(...heights));
			const span = Math.ceil(columnWidth * ratios[index] + gap);
			heights[column] += span;
			item.style.gridColumn = column + 1;
			item.style.gridRow = `span ${span}`;
		});
	};

	layout();
	const observer = new ResizeObserver(layout);
	observer.observe(gallery);
	observer.observe(items[0]);
}
