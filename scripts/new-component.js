// Scaffolds a new component folder: `npm run new:component -- <name>`.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const usage = `Usage: npm run new:component -- <name> [--template] [--paired] [--js]

  <name>       kebab-case, e.g. testimonials or pricing-card
  --template   template-only component (a .liquid include) instead of a shortcode
  --paired     shortcode wraps author-written markup ({% name %}...{% endname %})
  --js         also create a client-side <name>.js`;

const commandLineArguments = process.argv.slice(2);
const flags = new Set(commandLineArguments.filter((arg) => arg.startsWith("--")));
const [name] = commandLineArguments.filter((arg) => !arg.startsWith("--"));
const knownFlags = ["--template", "--paired", "--js"];
const unknownFlag = [...flags].find((flag) => !knownFlags.includes(flag));

if (!name || unknownFlag || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
	if (unknownFlag) console.error(`Unknown option: ${unknownFlag}\n`);
	else if (name) console.error(`"${name}" isn't a valid name — use lowercase kebab-case.\n`);
	console.error(usage);
	process.exit(1);
}

if (flags.has("--template") && flags.has("--paired")) {
	console.error("--template and --paired can't be combined.\n");
	console.error(usage);
	process.exit(1);
}

const directory = resolve(import.meta.dirname, "../src/_includes/components", name);

if (existsSync(directory)) {
	console.error(`Component "${name}" already exists at ${directory}`);
	process.exit(1);
}

const camelName = name.replace(/-([a-z0-9])/g, (_, character) => character.toUpperCase());
const title = name.replace(/-/g, " ").replace(/^./, (character) => character.toUpperCase());
const isTemplate = flags.has("--template");
const isPaired = flags.has("--paired");
const hasScript = flags.has("--js");

const shortcodeFile = isPaired
	? `export default function (eleventyConfig) {
	eleventyConfig.addPairedShortcode("${camelName}", (innerHtml) => {
		return \`<div class="${name}">\${innerHtml}</div>\`;
	});
}
`
	: `export default function (eleventyConfig) {
	eleventyConfig.addShortcode("${camelName}", (content = "") => {
		return \`<div class="${name}">\${content}</div>\`;
	});
}
`;

const templateFile = `<div class="${name}">
</div>
`;

const styleFile = `.${name} {
	margin-block: var(--size-4);
}
`;

const scriptFile = `const elements = document.querySelectorAll(".${name}");

if (elements.length) {
	elements.forEach((element) => {});
}
`;

let usageLine;
if (isTemplate) usageLine = `{% include "components/${name}/${name}.liquid" %}`;
else if (isPaired) usageLine = `{% ${camelName} %}...{% end${camelName} %}`;
else usageLine = `{% ${camelName} content %}`;

const readmeFile = `# ${title}

Describe what this component is for and when to use it.

## Usage

\`\`\`liquid
${usageLine}
\`\`\`

## Options

- Document each argument, its default, and what it changes.

## Accessibility

- Note the semantics, keyboard behavior, and any labels the author must supply.

## Notes

- Record decisions and gotchas that aren't obvious from the code, so they don't get undone.
`;

const files = {
	[`${name}.css`]: styleFile,
	"README.md": readmeFile,
};

if (isTemplate) files[`${name}.liquid`] = templateFile;
else files[`${name}.eleventy.js`] = shortcodeFile;
if (hasScript) files[`${name}.js`] = scriptFile;

mkdirSync(directory, { recursive: true });

for (const [file, contents] of Object.entries(files)) {
	writeFileSync(resolve(directory, file), contents);
}

console.log(`Created src/_includes/components/${name}/`);
Object.keys(files).forEach((file) => console.log(`  ${file}`));
console.log(`\nUse it with: ${usageLine}`);
console.log("\nComponents are discovered automatically — no registration needed.");
console.log("Restart `npm start` (or re-run `npm run build`) so the watchers pick up the new folder.");
