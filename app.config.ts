import { defineConfig } from "@solidjs/start/config";
import tsconfigPaths from "vite-tsconfig-paths";
import Icons from "unplugin-icons/vite";

export default defineConfig({
	ssr: false,
	vite: {
		plugins: [tsconfigPaths(), Icons({ compiler: "solid" })],
	},
});
