import { config } from "dotenv";
import { z } from "zod";

// Carrega variáveis de ambiente do arquivo .env se LOAD_ENV_FILE for true
if (process.env.LOAD_ENV_FILE === "true") {
	config();
}

// Validação para URL do banco de dados
const databaseUrlSchema = z
	.string({
		required_error: "DATABASE_URL é obrigatória",
	})
	.refine((url) => url.startsWith("postgres://"), {
		message: "DATABASE_URL deve começar com postgres://",
	});

// Validação para porta
const portSchema = z.coerce
	.number({
		required_error: "PORT deve ser um número",
	})
	.refine((port) => port > 0 && port <= 65535 && Number.isInteger(port), {
		message: "PORT deve ser um número inteiro entre 1 e 65535",
	});

// Schema de validação para variáveis de ambiente
const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	DATABASE_URL: databaseUrlSchema,
	PORT: portSchema.default(3000),
});

// Função para obter DATABASE_URL padrão para ambiente de teste
function getDefaultDatabaseUrl(
	env: string,
	testMode?: string,
): string | undefined {
	if (env === "test" && testMode === "index") {
		return "postgres://test:test@localhost:5432/test";
	}
	return process.env.DATABASE_URL;
}

function validateEnv() {
	const nodeEnv = process.env.NODE_ENV || "development";

	try {
		return envSchema.parse({
			NODE_ENV: process.env.NODE_ENV,
			DATABASE_URL: getDefaultDatabaseUrl(nodeEnv, process.env.TEST_MODE),
			PORT: process.env.PORT,
		});
	} catch (error) {
		throw new Error(
			`Invalid environment variables for ${nodeEnv} environment.`,
		);
	}
}

export const env = validateEnv();
