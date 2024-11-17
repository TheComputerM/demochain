import { defineConfig } from "@solidjs/start/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	ssr: false,
	vite: {
		plugins: [tsconfigPaths()],
	},
});
