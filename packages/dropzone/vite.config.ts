import { defineConfig } from "vite";
import { resolve } from "path";
import pkg from "./package.json";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	build: {
		lib: {
			entry: resolve(__dirname, "lib/index.ts"),
			name: "UploadButton",
			formats: ["cjs", "es"],
		},
		minify: false,
		sourcemap: "inline",
		rollupOptions: {
			external: [...Object.keys(pkg.peerDependencies), "preact/hooks"],
		},
	},
});
