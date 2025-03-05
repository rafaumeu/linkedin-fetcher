export const env = {
	NODE_ENV: process.env.NODE_ENV || "test",
	PORT: 3333,
	DATABASE_URL: "postgres://test:test@localhost:5432/test",
};
