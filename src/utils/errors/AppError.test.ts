import {
	LinkedInRateLimitError,
	NavigationError,
	NotFoundError,
	ProfileNotFoundError,
	ValidationError,
} from "./AppError";

describe("AppError", () => {
	describe("ValidationError", () => {
		it("should create ValidationError with correct properties", () => {
			const message = "Invalid input";
			const error = new ValidationError(message);

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(ValidationError);
			expect(error.message).toBe(message);
			expect(error.name).toBe("ValidationError");
			expect(error.statusCode).toBe(400);
		});

		it("should maintain stack trace", () => {
			const error = new ValidationError("Test error");
			expect(error.stack).toBeDefined();
		});
	});

	describe("ProfileNotFoundError", () => {
		it("should create ProfileNotFoundError with correct properties", () => {
			const profileUrl = "https://linkedin.com/in/not-found";
			const error = new ProfileNotFoundError(profileUrl);

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(ProfileNotFoundError);
			expect(error.message).toBe(`Perfil não encontrado: ${profileUrl}`);
			expect(error.name).toBe("ProfileNotFoundError");
			expect(error.profileUrl).toBe(profileUrl);
		});

		it("should maintain stack trace", () => {
			const error = new ProfileNotFoundError("https://linkedin.com/in/test");
			expect(error.stack).toBeDefined();
		});

		it("should handle empty profile URL", () => {
			const error = new ProfileNotFoundError("");
			expect(error.message).toBe("Perfil não encontrado: ");
			expect(error.profileUrl).toBe("");
		});
	});

	// Add tests for NotFoundError
	describe("NotFoundError", () => {
		it("should create NotFoundError with correct properties", () => {
			const resource = "Usuário";
			const error = new NotFoundError(resource);

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(NotFoundError);
			expect(error.message).toBe(`${resource} não encontrado`);
			expect(error.name).toBe("NotFoundError");
			expect(error.statusCode).toBe(404);
		});

		it("should maintain stack trace", () => {
			const error = new NotFoundError("Recurso");
			expect(error.stack).toBeDefined();
		});
	});

	// Add tests for LinkedInRateLimitError
	describe("LinkedInRateLimitError", () => {
		it("should create LinkedInRateLimitError with correct properties", () => {
			const error = new LinkedInRateLimitError();

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(LinkedInRateLimitError);
			expect(error.message).toBe(
				"Limite de taxa do LinkedIn atingido. Tempo de espera: 30 minutos",
			);
			expect(error.name).toBe("LinkedInRateLimitError");
			expect(error.statusCode).toBe(429);
		});

		it("should maintain stack trace", () => {
			const error = new LinkedInRateLimitError();
			expect(error.stack).toBeDefined();
		});
	});

	// Add tests for NavigationError
	describe("NavigationError", () => {
		it("should create NavigationError with correct properties", () => {
			const message = "Falha ao navegar para a página";
			const error = new NavigationError(message);

			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(NavigationError);
			expect(error.message).toBe(`Erro de navegação: ${message}`);
			expect(error.name).toBe("NavigationError");
			expect(error.statusCode).toBe(500);
		});

		it("should maintain stack trace", () => {
			const error = new NavigationError("Timeout");
			expect(error.stack).toBeDefined();
		});
	});
});
