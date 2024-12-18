import { defineConfig } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";
import sky from "@park-ui/panda-preset/colors/sky";
import slate from "@park-ui/panda-preset/colors/slate";

export default defineConfig({
	// Whether to use css reset
	preflight: true,

	presets: [createPreset({ accentColor: sky, grayColor: slate, radius: "md" })],

	// Where to look for your css declarations
	include: ["./src/**/*.{js,jsx,ts,tsx}"],

	// Files to exclude
	exclude: [],

	globalVars: {
		extend: {
			"--global-font-body": "'Outfit Variable', sans-serif",
		},
	},

	// Useful for theme customization
	theme: {
		extend: {},
	},

	// The output directory for your css system
	outdir: "styled-system",

	jsxFramework: "solid",
});
