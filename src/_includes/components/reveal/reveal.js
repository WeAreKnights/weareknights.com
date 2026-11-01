// Fades sections, galleries and `.reveal` elements in the first time they scroll into view (styles in reveal.css).

import { whenVisible } from "../../../assets/lib/when-visible.js";

const revealTargets = document.querySelectorAll("section, .reveal, .gallery");

const visibleFraction = 0.15;
const bottomMargin = "0px 0px -10% 0px";

whenVisible(revealTargets, (target) => target.classList.add("is-visible"), { threshold: visibleFraction, rootMargin: bottomMargin });
