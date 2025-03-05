import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { logger } from "../logger"; // Implementar um serviço de logging
import { AppError } from "./AppError";

/**
 * Handler centralizado para tratamento de erros
 */
export function errorHandler(
	error: Error | FastifyError | ZodError | AppError,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const errorContext = {
		path: request.url,
		method: request.method,
		errorName: error.name,
		timestamp: new Date().toISOString(),
	};

	// Logging estruturado
	logger.error(`API Error: ${error.message}`, errorContext);

	// Erros de validação do Zod
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: "Erro de validação.",
			issues: error.format(),
		});
	}

	// Erros da aplicação
	if (error instanceof AppError) {
		return reply.status(error.statusCode).send({
			message: error.message,
			code: error.name,
		});
	}

	// Erros não tratados
	console.error(`[ERROR] ${error.name}: ${error.message}`, error.stack);

	return reply.status(500).send({
		message: "Erro interno do servidor.",
		code: "InternalServerError",
	});
}
