import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkConnection, client, query } from "./connection";

// Mock the client and dependencies
vi.mock("../env", () => ({
	env: {
		DATABASE_URL: "mock-connection-string",
	},
}));

// Mock postgres and drizzle
vi.mock("postgres", () => ({
	default: vi.fn().mockReturnValue({
		query: vi.fn(),
	}),
}));

vi.mock("drizzle-orm/postgres-js", () => ({
	drizzle: vi.fn().mockReturnValue({}),
}));

// Mock console.error
const originalConsoleError = console.error;

describe("Database connection", () => {
	beforeEach(() => {
		// Reset mocks before each test
		vi.resetAllMocks();
		console.error = vi.fn();
	});

	afterEach(() => {
		// Restore console.error after each test
		console.error = originalConsoleError;
	});

	describe("checkConnection", () => {
		it("should return true when database connection is successful", async () => {
			// Mock successful query execution
			// @ts-ignore
			client.query = vi.fn().mockResolvedValue([{ "?column?": 1 }]);

			const result = await checkConnection();

			expect(result).toBe(true);
			// @ts-ignore
			expect(client.query).toHaveBeenCalledWith("SELECT 1");
			expect(console.error).not.toHaveBeenCalled();
		});

		it("should return false when database connection fails", async () => {
			const testError = new Error("Connection failed");

			// Mock failed query execution
			// @ts-ignore
			client.query = vi.fn().mockRejectedValue(testError);

			const result = await checkConnection();

			expect(result).toBe(false);
			// @ts-ignore
			expect(client.query).toHaveBeenCalledWith("SELECT 1");
			expect(console.error).toHaveBeenCalledWith(
				"Database connection error:",
				testError,
			);
		});

		it("should handle different types of errors", async () => {
			const testError = "String error instead of Error object";

			// Mock failed query with non-Error object
			// @ts-ignore
			client.query = vi.fn().mockRejectedValue(testError);

			const result = await checkConnection();

			expect(result).toBe(false);
			expect(console.error).toHaveBeenCalledWith(
				"Database connection error:",
				testError,
			);
		});
	});

	describe("query", () => {
		it("should execute query with provided parameters", async () => {
			const mockResult = [{ id: 1, name: "Test" }];
			// @ts-ignore
			client.query = vi.fn().mockResolvedValue(mockResult);

			const testQuery = "SELECT * FROM users WHERE id = $1";
			const params = [1];

			const result = await query(testQuery, params);

			expect(result).toBe(mockResult);
			// @ts-ignore
			expect(client.query).toHaveBeenCalledWith(testQuery, params);
		});

		it("should execute query without parameters", async () => {
			const mockResult = [{ id: 1, name: "Test" }];
			// @ts-ignore
			client.query = vi.fn().mockResolvedValue(mockResult);

			const testQuery = "SELECT * FROM users";

			const result = await query(testQuery);

			expect(result).toBe(mockResult);
			// @ts-ignore
			expect(client.query).toHaveBeenCalledWith(testQuery, []);
		});
	});
});
