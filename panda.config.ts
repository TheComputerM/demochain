import { defineConfig } from "@pandacss/dev";

export default defineConfig({
	// Whether to use css reset
	preflight: true,

	presets: ["@pandacss/preset-base", "@park-ui/panda-preset"],

	// Where to look for your css declarations
	include: ["./src/**/*.{js,jsx,ts,tsx}"],

	// Files to exclude
	exclude: [],

	globalVars: {
		extend: {
			'--global-font-body': "'Outfit Variable', sans-serif"
		}
	},

	// Useful for theme customization
	theme: {
		extend: {},
	},

	// The output directory for your css system
	outdir: "styled-system",

	jsxFramework: "solid",
});
