import postgres from "postgres";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkConnection } from "./connection";

// Mock postgres com implementação mais completa
vi.mock("postgres", () => {
	// Criar um mock do cliente postgres que suporta template literals
	const mockTagFunction = vi.fn().mockResolvedValue([{ result: 1 }]);
	const clientMock = () => {
		// Criar uma função que pode ser chamada como template literal
		const handler = mockTagFunction;
		return handler;
	};

	return {
		default: vi.fn(() => clientMock()),
	};
});

// Mock drizzle-orm
vi.mock("drizzle-orm/postgres-js", () => ({
	drizzle: vi.fn(() => ({
		execute: vi.fn(),
	})),
}));

// Mock env para evitar erros de validação
vi.mock("../env", () => ({
	env: {
		DATABASE_URL: "postgres://test:test@localhost:5432/test",
		NODE_ENV: "test",
		PORT: 3333,
	},
}));

describe("Database Connection", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetModules();
	});

	it("should successfully check connection", async () => {
		// O mock já está configurado para retornar sucesso
		const result = await checkConnection();
		expect(result).toBe(true);
	});

	it("should handle failed connection", async () => {
		// Sobrescrever o mock para este teste específico
		const postgres = await import("postgres");
		const mockClient = postgres.default();

		// Fazer o mock rejeitar para este teste
		vi.mocked(mockClient).mockRejectedValueOnce(new Error("Connection failed"));

		const result = await checkConnection();
		expect(result).toBe(false);
	});
});
