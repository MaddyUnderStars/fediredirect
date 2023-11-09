const esbuild = require("esbuild");

esbuild.build({
	entryPoints: [
		"./src/redirector.ts",
		"./src/settings/index.ts",
		"./src/popup/index.ts",
	],
	bundle: true,
	minify: true,
	sourcemap: process.env.NODE_ENV !== "production",
	target: ["firefox57"],
	outdir: "./build",
	define: {
		"process.env.NODE_ENV": `"${process.env.NODE_ENV}"`
	}
})
.catch((e) => process.exit(1));