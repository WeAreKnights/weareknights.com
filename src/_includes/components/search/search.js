// Loads the Pagefind search UI the first time a `[data-search]` element is near the viewport, and focuses its input when it sits inside a popup.

import { whenVisible, preloadMargin } from "../../../assets/lib/when-visible.js";

const searches = document.querySelectorAll("[data-search]");

if (searches.length) {
	const basePath = "/pagefind/";
	let loading;

	const loadPagefind = () => {
		loading ??= new Promise((resolve, reject) => {
			const stylesheet = document.createElement("link");
			stylesheet.rel = "stylesheet";
			stylesheet.href = `${basePath}pagefind-ui.css`;
			document.head.append(stylesheet);

			const script = document.createElement("script");
			script.src = `${basePath}pagefind-ui.js`;
			script.onload = resolve;
			script.onerror = reject;
			document.head.append(script);
		});

		return loading;
	};

	const start = async (element) => {
		try {
			await loadPagefind();
		} catch {
			element.textContent = "Search is unavailable right now.";
			return;
		}

		new PagefindUI({
			element,
			showImages: false,
			showSubResults: false,
			resetStyles: false,
			autofocus: Boolean(element.closest("dialog")),
		});
	};

	whenVisible(searches, start, { rootMargin: preloadMargin });
}
