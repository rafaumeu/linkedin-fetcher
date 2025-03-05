import { AppError } from "@/test/stubs/utils/errors/AppError";

export class BrowserService {
	private browser: any = null;

	async initialize() {
		if (this.browser) return this.browser;
		try {
			this.browser = { newPage: () => ({}) };
			return this.browser;
		} catch (error) {
			if (error instanceof Error) {
				throw new AppError(
					`Failed to initialize browser: ${error.message}`,
					500,
				);
			}
			throw new AppError("Failed to initialize browser: Unknown error", 500);
		}
	}

	async getPage() {
		if (!this.browser) await this.initialize();
		return {
			goto: async () => {},
			setUserAgent: async () => {},
			evaluate: async () => ({}),
		};
	}

	async close() {
		if (this.browser) {
			await this.browser.close();
			this.browser = null;
		}
	}
}
