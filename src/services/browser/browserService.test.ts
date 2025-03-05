import puppeteer from "puppeteer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../../utils/errors/AppError";
import { BrowserService } from "./browserService";

// Mock puppeteer
vi.mock("puppeteer", () => ({
	default: {
		launch: vi.fn(),
	},
}));

describe("BrowserService", () => {
	let browserService: BrowserService;
	const mockBrowser = {
		newPage: vi.fn(),
		close: vi.fn(),
	};
	const mockPage = {
		setUserAgent: vi.fn(),
		goto: vi.fn(),
	};

	beforeEach(() => {
		browserService = new BrowserService();
		vi.clearAllMocks();

		// Default mock implementation
		mockBrowser.newPage.mockResolvedValue(mockPage);
		vi.mocked(puppeteer.launch).mockResolvedValue(mockBrowser as any);
	});

	afterEach(async () => {
		await browserService.close();
	});

	describe("initialize", () => {
		it("should initialize browser successfully", async () => {
			await browserService.initialize();
			expect(puppeteer.launch).toHaveBeenCalledTimes(1);
		});

		it("should not reinitialize browser if already initialized", async () => {
			await browserService.initialize();
			await browserService.initialize();
			expect(puppeteer.launch).toHaveBeenCalledTimes(1);
		});

		it("should handle Error objects in catch block", async () => {
			const errorMessage = "Browser launch failed";
			vi.mocked(puppeteer.launch).mockRejectedValue(new Error(errorMessage));

			await expect(browserService.initialize()).rejects.toThrow(
				new AppError(`Failed to initialize browser: ${errorMessage}`, 500),
			);
		});

		it("should handle non-Error objects in catch block", async () => {
			vi.mocked(puppeteer.launch).mockRejectedValue("String error");

			await expect(browserService.initialize()).rejects.toThrow(
				new AppError("Failed to initialize browser: Unknown error", 500),
			);
		});
	});

	describe("getPage", () => {
		it("should initialize browser if not initialized", async () => {
			await browserService.getPage();
			expect(puppeteer.launch).toHaveBeenCalledTimes(1);
		});

		it("should throw error if browser initialization fails", async () => {
			// Mock initialize to set browser to null
			vi.spyOn(browserService as any, "initialize").mockImplementation(
				async () => {
					(browserService as any).browser = null;
				},
			);

			await expect(browserService.getPage()).rejects.toThrow(
				new AppError("Browser initialization failed", 500),
			);
		});

		it("should set user agent if function exists", async () => {
			await browserService.getPage();
			expect(mockPage.setUserAgent).toHaveBeenCalled();
		});

		it("should not throw if setUserAgent function doesn't exist", async () => {
			const pageWithoutSetUserAgent = { goto: vi.fn() };
			mockBrowser.newPage.mockResolvedValue(pageWithoutSetUserAgent as any);

			const page = await browserService.getPage();
			expect(page).toBe(pageWithoutSetUserAgent);
		});
	});

	describe("close", () => {
		it("should close browser if initialized", async () => {
			await browserService.initialize();
			await browserService.close();
			expect(mockBrowser.close).toHaveBeenCalledTimes(1);
		});

		it("should not attempt to close if browser is null", async () => {
			// Don't initialize
			await browserService.close();
			expect(mockBrowser.close).not.toHaveBeenCalled();
		});
	});
});
