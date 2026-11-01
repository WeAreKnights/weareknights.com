// Builds the Facebook Page plugin iframe when it nears the viewport and rebuilds it at the container's width (within Facebook's allowed range) after resizes.

import { whenVisible, preloadMargin } from "../../../assets/lib/when-visible.js";

const embeds = document.querySelectorAll("[data-facebook-embed]");

if (embeds.length) {
	const minWidth = 180;
	const maxWidth = 500;
	const resizeDebounceMilliseconds = 250;

	const render = (embed) => {
		const frame = embed.querySelector(".facebook-embed-frame");
		const { href, tabs, height, compact, facepile } = embed.dataset;
		const width = Math.round(Math.min(maxWidth, Math.max(minWidth, frame.getBoundingClientRect().width)));

		let iframe = frame.querySelector("iframe");

		if (!iframe) {
			iframe = document.createElement("iframe");
			iframe.title = "Facebook Page";
			iframe.height = height;
			iframe.scrolling = "no";
			iframe.loading = "lazy";
			iframe.referrerPolicy = "strict-origin-when-cross-origin";
			iframe.allow = "encrypted-media; picture-in-picture; web-share";
			frame.append(iframe);
		}

		if (iframe.dataset.width === String(width)) return;

		const embedQuery = new URLSearchParams({
			href,
			tabs,
			width,
			height,
			small_header: compact === "true",
			hide_cover: compact === "true",
			show_facepile: facepile === "true",
		});

		iframe.width = width;
		iframe.dataset.width = width;
		iframe.src = `https://www.facebook.com/plugins/page.php?${embedQuery}`;
	};

	const observed = new Set();
	let resizeTimer;

	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => observed.forEach(render), resizeDebounceMilliseconds);
	});

	whenVisible(
		embeds,
		(embed) => {
			observed.add(embed);
			render(embed);
		},
		{ rootMargin: preloadMargin }
	);
}
