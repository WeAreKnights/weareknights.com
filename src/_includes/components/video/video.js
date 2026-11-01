// Loads autoplay video iframes only when they scroll into view, so off-screen videos cost nothing.

import { whenVisible } from "../../../assets/lib/when-visible.js";

const autoplayEmbeds = document.querySelectorAll("[data-video-autoplay]");

whenVisible(autoplayEmbeds, (embed) => {
	embed.querySelector("iframe").src = embed.dataset.src;
});
