import { vi } from "vitest";

// Mock para o módulo dotenv
vi.mock("dotenv", () => ({
	config: vi.fn(),
}));

// Mock para o módulo zod
vi.mock("zod", async () => {
	const actualModule = await vi.importActual<typeof import("zod")>("zod");

	return {
		// Usar o módulo real como base
		...actualModule,
		// Sobrescrever apenas o objeto z com nossos mocks
		z: {
			string: () => ({
				refine: () => ({
					message: () => {},
				}),
			}),
			coerce: {
				number: () => ({
					refine: () => ({
						message: () => {},
						default: () => {},
					}),
				}),
			},
			enum: () => ({
				default: () => {},
			}),
			object: () => ({
				parse: vi.fn(),
			}),
		},
	};
});

// Configurar variáveis de ambiente padrão para testes
vi.stubEnv("NODE_ENV", "test");
vi.stubEnv("PORT", "3333");
vi.stubEnv("DATABASE_URL", "postgres://user:pass@localhost:5432/test");
vi.stubEnv("LINKEDIN_RATE_LIMIT", "100");
vi.stubEnv("MAX_RETRIES", "3");

// Add validation mock
vi.mock("@/env", () => ({
	env: {
		validate: vi.fn().mockImplementation(() => {
			if (!process.env.DATABASE_URL) {
				throw new Error("Invalid environment variables");
			}
			return true;
		}),
	},
}));

// Replace the zod mock with this implementation
vi.mock("zod", () => ({
	z: {
		enum: vi.fn().mockReturnValue({
			default: vi.fn(),
		}),
		string: () => ({
			refine: vi.fn(),
		}),
		number: () => ({
			refine: vi.fn(),
		}),
		object: () => ({
			parse: vi.fn().mockImplementation((obj) => obj),
		}),
	},
}));
