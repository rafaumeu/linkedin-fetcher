/**
 * Classe base para erros da aplicação
 */
/**
 * Classe para erros operacionais da aplicação
 * Usada para diferenciar erros esperados (como validação) de bugs
 */
export class AppError extends Error {
	public readonly statusCode: number;
	public readonly isOperational: boolean;

	constructor(message: string, statusCode = 400, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.name = "AppError";

		// Captura a stack trace correta
		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Erro para validação de dados
 */
export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 400);
		this.name = "ValidationError";
	}
}

/**
 * Erro para recursos não encontrados
 */
export class NotFoundError extends AppError {
	constructor(resource: string) {
		super(`${resource} não encontrado`, 404);
		this.name = "NotFoundError";
	}
}

/**
 * Erro específico para perfis do LinkedIn não encontrados
 */
// Update the ProfileNotFoundError class to include the profileUrl property
export class ProfileNotFoundError extends Error {
	profileUrl: string;

	constructor(profileUrl: string) {
		super(`Profile not found: ${profileUrl}`);
		this.name = "ProfileNotFoundError";
		this.profileUrl = profileUrl;

		// This maintains proper prototype chain in transpiled JavaScript
		Object.setPrototypeOf(this, ProfileNotFoundError.prototype);
	}
}

/**
 * Erro para limite de taxa do LinkedIn
 */
export class LinkedInRateLimitError extends AppError {
	constructor() {
		super(
			"Limite de taxa do LinkedIn atingido, implementando período de espera",
			429,
		);
		this.name = "LinkedInRateLimitError";
	}
}

/**
 * Erro para problemas de navegação
 */
export class NavigationError extends AppError {
	constructor(message: string) {
		super(`Erro de navegação: ${message}`, 500);
		this.name = "NavigationError";
	}
}
