// Turns each `.slider` into a scroll-snapping carousel: adds previous/next buttons, page dots, and optional autoplay with a pause button.
// A "page" is however many slides fit in view; it is measured from layout, so pages and dots adapt when the viewport resizes.

const chevronPaths = {
	previous: "m15 5-7 7 7 7",
	next: "m9 5 7 7-7 7",
};

const chevron = (direction) =>
	`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${chevronPaths[direction]}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const icons = {
	pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
	play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7Z" fill="currentColor"/></svg>',
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const createButton = (className, label, html) => {
	const button = document.createElement("button");
	button.type = "button";
	button.className = className;
	button.setAttribute("aria-label", label);
	button.innerHTML = html;
	return button;
};

const labelSlides = (slides) => {
	slides.forEach((slide, index) => {
		if (!slide.getAttribute("role") && slide.matches("div, section")) slide.setAttribute("role", "group");
		slide.setAttribute("aria-roledescription", "slide");
		slide.setAttribute("aria-label", `${index + 1} of ${slides.length}`);
	});
};

const createPager = (track, slides) => {
	const measureLayout = () => {
		const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
		const slideStep = slides[0].getBoundingClientRect().width + gap;
		const slidesPerPage = Math.max(1, Math.round((track.clientWidth + gap) / slideStep));
		const maxScrollLeft = track.scrollWidth - track.clientWidth;
		return { slideStep, slidesPerPage, maxScrollLeft, pageCount: Math.ceil(slides.length / slidesPerPage) };
	};

	const goToPage = (page) => {
		const { slideStep, slidesPerPage, maxScrollLeft } = measureLayout();
		track.scrollTo({ left: Math.min(page * slidesPerPage * slideStep, maxScrollLeft) });
	};

	const currentPage = () => {
		const { slideStep, slidesPerPage, maxScrollLeft, pageCount } = measureLayout();
		if (track.scrollLeft >= maxScrollLeft - 1) return pageCount - 1;
		return Math.min(pageCount - 1, Math.floor(Math.round(track.scrollLeft / slideStep) / slidesPerPage));
	};

	const advance = (direction) => {
		const { pageCount } = measureLayout();
		goToPage((currentPage() + direction + pageCount) % pageCount);
	};

	return { measureLayout, goToPage, currentPage, advance };
};

const createDots = (container, pager) => {
	let dots = [];
	let renderedPageCount = 0;

	const render = (pageCount) => {
		if (pageCount === renderedPageCount) return;
		renderedPageCount = pageCount;
		dots = Array.from({ length: pageCount }, (_, page) => {
			const firstSlideNumber = page * pager.measureLayout().slidesPerPage + 1;
			const dot = createButton("slider-dot", `Go to slide ${firstSlideNumber}`, "");
			dot.addEventListener("click", () => pager.goToPage(page));
			return dot;
		});
		container.replaceChildren(...dots);
	};

	const forceRender = () => {
		renderedPageCount = 0;
	};

	const markCurrent = (currentPage) => {
		dots.forEach((dot, index) => {
			if (index === currentPage) dot.setAttribute("aria-current", "true");
			else dot.removeAttribute("aria-current");
		});
	};

	return { render, forceRender, markCurrent };
};

const startAutoplay = (slider, intervalMilliseconds, advance) => {
	let timer;
	let isPausedByUser = false;
	let isHovered = false;
	let hasFocus = false;
	let isInView = true;

	const shouldAutoplay = () => !isPausedByUser && !isHovered && !hasFocus && isInView && !document.hidden;

	const restartAutoplay = () => {
		clearInterval(timer);
		if (shouldAutoplay()) timer = setInterval(() => advance(1), intervalMilliseconds);
	};

	const pauseButton = createButton("slider-button slider-pause", "Pause autoplay", icons.pause);
	pauseButton.addEventListener("click", () => {
		isPausedByUser = !isPausedByUser;
		pauseButton.setAttribute("aria-label", isPausedByUser ? "Start autoplay" : "Pause autoplay");
		pauseButton.innerHTML = isPausedByUser ? icons.play : icons.pause;
		restartAutoplay();
	});

	slider.addEventListener("mouseenter", () => ((isHovered = true), restartAutoplay()));
	slider.addEventListener("mouseleave", () => ((isHovered = false), restartAutoplay()));
	slider.addEventListener("focusin", () => ((hasFocus = true), restartAutoplay()));
	slider.addEventListener("focusout", () => ((hasFocus = false), restartAutoplay()));
	document.addEventListener("visibilitychange", restartAutoplay);

	new IntersectionObserver(([entry]) => {
		isInView = entry.isIntersecting;
		restartAutoplay();
	}).observe(slider);

	restartAutoplay();
	return pauseButton;
};

document.querySelectorAll(".slider").forEach((slider) => {
	const track = slider.querySelector(".slider-track");
	const slides = [...track.children];
	if (!slides.length) return;

	labelSlides(slides);

	const pager = createPager(track, slides);
	const showDots = slider.dataset.dots !== "false";

	const controls = document.createElement("div");
	controls.className = "slider-controls";

	const previousButton = createButton("slider-button slider-previous", "Previous slide", chevron("previous"));
	const nextButton = createButton("slider-button slider-next", "Next slide", chevron("next"));
	previousButton.addEventListener("click", () => pager.advance(-1));
	nextButton.addEventListener("click", () => pager.advance(1));

	const dotsContainer = document.createElement("div");
	dotsContainer.className = "slider-dots";
	dotsContainer.setAttribute("role", "group");
	dotsContainer.setAttribute("aria-label", "Choose slide");
	const dots = createDots(dotsContainer, pager);

	const refreshControls = () => {
		const { pageCount, maxScrollLeft } = pager.measureLayout();
		controls.hidden = maxScrollLeft <= 1;
		if (!showDots) return;
		dots.render(pageCount);
		dots.markCurrent(pager.currentPage());
	};

	let animationFrame;
	track.addEventListener(
		"scroll",
		() => {
			cancelAnimationFrame(animationFrame);
			animationFrame = requestAnimationFrame(refreshControls);
		},
		{ passive: true }
	);

	if ("ResizeObserver" in window) {
		new ResizeObserver(() => {
			dots.forceRender();
			refreshControls();
		}).observe(track);
	}

	const autoplayIntervalMilliseconds = Number(slider.dataset.autoplay);
	const pauseButton =
		autoplayIntervalMilliseconds > 0 && !prefersReducedMotion.matches
			? startAutoplay(slider, autoplayIntervalMilliseconds, pager.advance)
			: null;

	controls.append(previousButton);
	if (pauseButton) controls.append(pauseButton);
	if (showDots) controls.append(dotsContainer);
	controls.append(nextButton);
	slider.append(controls);

	refreshControls();
});
