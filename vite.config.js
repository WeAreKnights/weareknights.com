// Vite builds only the CSS/JS bundle into `_site/assets`; Eleventy builds the pages.

import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
	css: {
		transformer: "lightningcss",
		lightningcss: {
			drafts: { customMedia: true },
		},
	},
	build: {
		outDir: "_site/assets",
		emptyOutDir: false,
		manifest: true,
		cssMinify: "lightningcss",
		rollupOptions: {
			input: {
				main: resolve(import.meta.dirname, "src/assets/main.js"),
			},
			output: {
				entryFileNames: "js/[name].[hash].js",
				chunkFileNames: "js/[name].[hash].js",
				assetFileNames: "css/[name].[hash][extname]",
			},
		},
	},
});
