import { resolve } from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		environment: "node",
		include: ["src/**/*.{test,spec}.ts"],
		exclude: ["src/**/*.e2e.test.ts"],
		setupFiles: ["./src/test/setup.ts"],
		reporters: ["verbose"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html", "lcov"],
			include: ["src/**/*.ts"],
			exclude: [
				"src/**/*.test.ts",
				"src/**/*.spec.ts",
				"src/**/*.e2e.test.ts",
				"src/index.ts",
				"src/server.ts",
				"src/routes/health.ts",
				"src/utils/logger.ts",
				"src/types/**",
				"src/test/**",
			],
			all: true,
			thresholds: {
				statements: 90,
				branches: 85,
				functions: 90,
				lines: 90,
				perFile: true,
			},
			reportOnFailure: true,
			reportsDirectory: "./coverage/unit",
		},
		pool: "forks",
		clearMocks: true,
		mockReset: true,
		restoreMocks: true,
		testTimeout: 10000,
		maxConcurrency: 5,
		isolate: true,
	},
});
