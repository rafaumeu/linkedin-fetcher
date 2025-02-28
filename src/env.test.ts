describe("Environment Configuration", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		vi.resetModules();
		process.env = { ...originalEnv };
		// Ensure we don't load any .env files during tests
		process.env.LOAD_ENV_FILE = "false";
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it("should load valid environment variables", async () => {
		process.env.NODE_ENV = "development";
		process.env.PORT = "3333";
		process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/test";
		const { env } = await import("./env");
		expect(env.PORT).toBe(3333);
		expect(env.DATABASE_URL).toBe("postgres://user:pass@localhost:5432/test");
	});

	it("should throw error for invalid environment variables", async () => {
		process.env.DATABASE_URL = undefined;
		await expect(import("./env")).rejects.toThrow(
			"Invalid environment variables",
		);
	});

	it("should load environment based on NODE_ENV", async () => {
		process.env.DATABASE_URL = "postgres://test:pass@localhost:5432/test";

		// Test production environment
		process.env.NODE_ENV = "production";
		await expect(import("./env")).resolves.not.toThrow();

		// Test test environment
		process.env.NODE_ENV = "test";
		await expect(import("./env")).resolves.not.toThrow();
	});
	it("should validate PORT number conversion", async () => {
		process.env.NODE_ENV = "development";
		process.env.DATABASE_URL = "postgres://test:pass@localhost:5432/test";

		// Teste com porta inválida
		process.env.PORT = "invalid";
		await expect(import("./env")).rejects.toThrow();

		// Teste com porta negativa
		process.env.PORT = "-3333";
		await expect(import("./env")).rejects.toThrow();
	});

	it("should validate DATABASE_URL format", async () => {
		process.env.NODE_ENV = "development";
		process.env.PORT = "3333";

		// Test missing DATABASE_URL
		process.env.DATABASE_URL = undefined;
		await expect(import("./env")).rejects.toThrow(
			"Invalid environment variables",
		);

		// Test invalid protocol
		process.env.DATABASE_URL = "http://user:pass@localhost:5432/test";
		await expect(import("./env")).rejects.toThrow(
			"Invalid environment variables",
		);

		// Test malformed URL
		process.env.DATABASE_URL = "postgres:invalid";
		await expect(import("./env")).rejects.toThrow(
			"Invalid environment variables",
		);
	});

	it("should validate NODE_ENV values", async () => {
		process.env.DATABASE_URL = "postgres://test:pass@localhost:5432/test";
		process.env.PORT = "3333";

		// Ambiente inválido
		process.env.NODE_ENV = "invalid";
		await expect(import("./env")).rejects.toThrow();
	});
	// Add test cases for different environments
	it("should load production environment variables", async () => {
		process.env.NODE_ENV = "production";
		process.env.DATABASE_URL = "postgres://prod:pass@localhost:5432/prod";
		const { env } = await import("./env");
		expect(env.NODE_ENV).toBe("production");
	});

	it("should default to development environment when NODE_ENV is not set", async () => {
		// Remove NODE_ENV to test default value
		process.env.NODE_ENV = undefined;
		process.env.DATABASE_URL = "postgres://dev:pass@localhost:5432/dev";

		const { env } = await import("./env");

		expect(env.NODE_ENV).toBe("development");
	});
	it("should validate environment specific configurations", async () => {
		// Test production specific validation
		process.env.NODE_ENV = "production";
		process.env.DATABASE_URL = "postgres://prod:pass@localhost:5432/prod";
		process.env.PORT = "80";
		const { env: prodEnv } = await import("./env");
		expect(prodEnv.NODE_ENV).toBe("production");
		expect(prodEnv.PORT).toBe(80);

		// Reset modules for next test
		vi.resetModules();

		// Test development specific validation
		process.env.NODE_ENV = "development";
		process.env.DATABASE_URL = "postgres://dev:pass@localhost:5432/dev";
		process.env.PORT = "3000";
		const { env: devEnv } = await import("./env");
		expect(devEnv.NODE_ENV).toBe("development");
		expect(devEnv.PORT).toBe(3000);
	});

	it("should handle edge cases in PORT validation", async () => {
		process.env.NODE_ENV = "development";
		process.env.DATABASE_URL = "postgres://test:pass@localhost:5432/test";

		// Test maximum port number
		process.env.PORT = "65535";
		await expect(import("./env")).resolves.not.toThrow();

		// Reset modules for next test
		vi.resetModules();
		process.env.NODE_ENV = "development";
		process.env.DATABASE_URL = "postgres://test:pass@localhost:5432/test";

		// Test port number too large
		process.env.PORT = "65536";
		await expect(import("./env")).rejects.toThrow();

		// Reset modules for next test
		vi.resetModules();
		process.env.NODE_ENV = "development";
		process.env.DATABASE_URL = "postgres://test:pass@localhost:5432/test";

		// Test decimal port number
		process.env.PORT = "3000.5";
		await expect(import("./env")).rejects.toThrow();
	});
	it("should load test environment file", async () => {
		process.env.NODE_ENV = "test";
		process.env.LOAD_ENV_FILE = "true";
		process.env.DATABASE_URL = "postgres://test:test@localhost:5432/test";

		const { env } = await import("./env");
		expect(env.NODE_ENV).toBe("test");
	});
	it("should use default DATABASE_URL in index test mode", async () => {
		process.env.NODE_ENV = "test";
		process.env.TEST_MODE = "index";

		const { env } = await import("./env");
		expect(env.DATABASE_URL).toBe("postgres://test:test@localhost:5432/test");
	});
	it("should use default environment in error message when NODE_ENV is not set", async () => {
  process.env.NODE_ENV = undefined;
  process.env.DATABASE_URL = "invalid-url";

  let errorThrown = false;
  try {
    await import("./env");
    // If we get here, no error was thrown
    expect(true).toBe(false); // Force test to fail if no error thrown
  } catch (error: unknown) {
    errorThrown = true;
    // Type guard to check if error is an Error object
    if (error instanceof Error) {
      expect(error.message).toBe(
        "Invalid environment variables for development environment."
      );
    } else {
      // If it's not an Error object, fail the test
      expect(true).toBe(false); // Force test to fail
    }
  }
  
  // Ensure an error was thrown
  expect(errorThrown).toBe(true);
});
});
