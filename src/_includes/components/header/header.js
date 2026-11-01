// Header behaviour: mobile menu toggle, navigation dropdowns (click, Escape, focus-out) and the scrolled state for sticky headers.

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
	navToggle.addEventListener("click", () => {
		const isOpen = navLinks.classList.toggle("is-open");
		navToggle.setAttribute("aria-expanded", String(isOpen));
	});

	navLinks.addEventListener("click", (event) => {
		if (event.target.tagName !== "A") return;
		navLinks.classList.remove("is-open");
		navToggle.setAttribute("aria-expanded", "false");
	});

	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape" || !navLinks.classList.contains("is-open")) return;
		navLinks.classList.remove("is-open");
		navToggle.setAttribute("aria-expanded", "false");
		navToggle.focus();
	});
}

const dropdowns = document.querySelectorAll(".nav-dropdown");

if (dropdowns.length) {
	const setOpen = (dropdown, isOpen) => {
		dropdown.classList.toggle("is-open", isOpen);
		dropdown.querySelector(".nav-dropdown-toggle").setAttribute("aria-expanded", String(isOpen));
	};

	dropdowns.forEach((dropdown) => {
		dropdown.querySelector(".nav-dropdown-toggle").addEventListener("click", () => {
			const willOpen = !dropdown.classList.contains("is-open");
			dropdowns.forEach((other) => setOpen(other, false));
			setOpen(dropdown, willOpen);
		});

		dropdown.addEventListener("focusout", (event) => {
			if (!dropdown.contains(event.relatedTarget)) setOpen(dropdown, false);
		});
	});

	document.addEventListener("click", (event) => {
		dropdowns.forEach((dropdown) => {
			if (!dropdown.contains(event.target)) setOpen(dropdown, false);
		});
	});

	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") return;
		dropdowns.forEach((dropdown) => {
			if (!dropdown.classList.contains("is-open")) return;
			setOpen(dropdown, false);
			dropdown.querySelector(".nav-dropdown-toggle").focus();
		});
	});
}

const stickyHeader = document.querySelector("header.header-sticky");

if (stickyHeader) {
	const update = () => stickyHeader.classList.toggle("is-scrolled", window.scrollY > 0);
	window.addEventListener("scroll", update, { passive: true });
	update();
}
