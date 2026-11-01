// Opens gallery thumbnails in a `<dialog>` lightbox with previous/next, backdrop-click and Escape to close, and returns focus to the thumbnail.

document.querySelectorAll(".gallery").forEach((gallery) => {
	const dialog = gallery.nextElementSibling;
	if (!dialog || !dialog.classList.contains("lightbox")) return;

	const items = [...gallery.querySelectorAll(".gallery-item")];
	const image = dialog.querySelector(".lightbox-image");
	let currentIndex = 0;
	let trigger = null;

	const show = (index) => {
		currentIndex = (index + items.length) % items.length;
		const item = items[currentIndex];
		image.src = item.dataset.src;
		image.alt = item.dataset.alt;
	};

	items.forEach((item, index) => {
		item.addEventListener("click", () => {
			trigger = item;
			show(index);
			dialog.showModal();
		});
	});

	const close = () => {
		dialog.close();
		trigger?.focus();
	};

	dialog.querySelector(".lightbox-previous").addEventListener("click", () => show(currentIndex - 1));
	dialog.querySelector(".lightbox-next").addEventListener("click", () => show(currentIndex + 1));
	dialog.querySelector(".lightbox-close").addEventListener("click", close);

	dialog.addEventListener("click", (event) => {
		if (event.target === dialog) close();
	});

	dialog.addEventListener("cancel", () => trigger?.focus());
});
