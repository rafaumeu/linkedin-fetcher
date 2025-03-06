import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/**/*.e2e.test.ts"],
		setupFiles: ["./src/test/setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html", "lcov"],
			include: ["src/**/*.ts"],
			exclude: [
				"src/**/*.test.ts",
				"src/**/*.spec.ts",
				"src/types/**",
				"src/test/**",
			],
			all: true,
			thresholds: {
				statements: 80,
				branches: 75,
				functions: 80,
				lines: 80,
				perFile: false,
			},
			reportOnFailure: true,
			reportsDirectory: "./coverage/e2e",
		},
		testTimeout: 30000, // Maior timeout para testes e2e
		maxConcurrency: 1, // Executar testes e2e sequencialmente
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
