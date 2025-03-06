import { vi } from "vitest";

export const env = {
	NODE_ENV: "test",
	PORT: 3333,
	DATABASE_URL: "postgres://user:pass@localhost:5432/test",
	LINKEDIN_RATE_LIMIT: 100,
	MAX_RETRIES: 3,
	validate: vi.fn().mockReturnValue(true),
};

// Reset mock between tests
export const resetEnvStub = () => {
	env.validate.mockReset().mockReturnValue(true);
};
