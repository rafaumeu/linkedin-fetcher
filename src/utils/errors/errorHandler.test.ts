import { errorHandler } from "@/utils/errors/errorHandler";
import type { FastifyReply, FastifyRequest } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { AppError } from "./AppError";

// Mock env para evitar erros de validação
vi.mock("../../env", () => ({
	env: {
		NODE_ENV: "test",
		DATABASE_URL: "postgres://test:test@localhost:5432/test",
		PORT: 3333,
	},
}));

describe("Error Handler", () => {
	// Fix: Create a proper mock for FastifyReply with chained methods
	let mockRequest: FastifyRequest;
	let mockReply: FastifyReply;
	let mockStatus: any;
	let mockSend: any;

	beforeEach(() => {
		mockSend = vi.fn().mockReturnThis();
		mockStatus = vi.fn().mockReturnValue({ send: mockSend });

		mockRequest = {} as FastifyRequest;
		mockReply = {
			status: mockStatus,
		} as unknown as FastifyReply;

		vi.clearAllMocks();
	});

	it("should handle AppError correctly", () => {
		const error = new AppError("Test error", 400);

		errorHandler(error, mockRequest, mockReply);

		expect(mockStatus).toHaveBeenCalledWith(400);
		expect(mockSend).toHaveBeenCalledWith({
			message: "Test error",
			code: "AppError",
		});
	});

	it("should handle generic errors as 500 Internal Server Error", () => {
		const error = new Error("Generic error");

		errorHandler(error, mockRequest, mockReply);

		expect(mockStatus).toHaveBeenCalledWith(500);
		expect(mockSend).toHaveBeenCalledWith({
			code: "InternalServerError",
			message: "Erro interno do servidor.",
		});
	});

	it("should handle ZodError validation errors", () => {
		// Create a schema and try to validate invalid data to generate a ZodError
		const schema = z.object({
			name: z.string().min(3),
			age: z.number().positive(),
		});

		const zodError = schema.safeParse({ name: "a", age: -1 }).error;

		if (zodError) {
			errorHandler(zodError, mockRequest, mockReply);
		}

		expect(mockStatus).toHaveBeenCalledWith(400);
		expect(mockSend).toHaveBeenCalledWith({
			message: "Erro de validação.",
			issues: expect.any(Object),
		});
	});
});
