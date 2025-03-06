import { AppError } from "@/test/stubs/utils/errors/AppError";
import { vi } from "vitest";

export const mockPage = {
	goto: vi.fn(),
	evaluate: vi.fn(),
	setUserAgent: vi.fn().mockResolvedValue(undefined),
};

export const mockBrowser = {
	newPage: vi.fn().mockResolvedValue(mockPage),
	close: vi.fn().mockResolvedValue(undefined),
};

export const browserService = {
	launch: vi.fn().mockImplementation(async () => {
		const mockBrowser = {
			newPage: vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn(),
				close: vi.fn(),
				setUserAgent: vi.fn(),
			}),
			close: vi.fn(),
			version: vi.fn().mockResolvedValue("1.0.0"),
		};
		return mockBrowser;
	}),
	isConnected: vi.fn().mockReturnValue(true),
	getBrowserVersion: vi.fn().mockResolvedValue("1.0.0"),
};

export class BrowserService {
	private browser: any = {
		close: () => Promise.resolve(),
		newPage: () =>
			Promise.resolve({
				goto: () => Promise.resolve(),
				setUserAgent: () => Promise.resolve(),
				evaluate: () => Promise.resolve(),
			}),
	};

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

	async waitForSelector(selector: string) {
		return { click: () => {} };
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

export default {
  initialize: vi.fn().mockResolvedValue({
    newPage: vi.fn().mockResolvedValue({
      goto: vi.fn().mockResolvedValue(null),
      evaluate: vi.fn().mockImplementation(async () => ({
        name: "Test & Name",
        headline: "Test <Dev>",
        location: 'Test "Location"',
        experience: [],
        education: [],
        certifications: [],
        about: ""
      })),
      close: vi.fn(),
      setUserAgent: vi.fn()
    }),
    close: vi.fn()
  }),
  getPage: vi.fn().mockResolvedValue({
    evaluate: vi.fn(),
    goto: vi.fn(),
    setUserAgent: vi.fn()
  })
};
