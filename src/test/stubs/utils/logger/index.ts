// Add missing transport configuration
export const transport = {
	filename: "logs/stub.log",
	level: "info",
};

export const logger = {
	info: vi.fn(),
	error: vi.fn(),
	warn: vi.fn(),
	debug: vi.fn(),
};
