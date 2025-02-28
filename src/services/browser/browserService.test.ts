import { BrowserService } from "@/services/browser/browserService";
import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

vi.mock("puppeteer", () => ({
	default: {
		launch: vi.fn().mockResolvedValue({
			newPage: vi.fn().mockResolvedValue({}),
			close: vi.fn(),
		}),
	},
}));

describe("BrowserService", () => {
	let browserService: BrowserService;
	let mockBrowser: Partial<Browser>;
	let mockPage: Partial<Page>;

	beforeEach(() => {
		mockPage = {
			goto: vi.fn(),
			evaluate: vi
				.fn()
				.mockImplementation(
					async <T>(pageFunction: () => T, ...args: unknown[]) => {
						if (typeof pageFunction === "function") {
							return pageFunction();
						}
						return undefined;
					},
				) as unknown as Page["evaluate"],
		};

		mockBrowser = {
			newPage: vi.fn().mockResolvedValue(mockPage),
			close: vi.fn(),
			process: vi.fn(),
			createBrowserContext: vi.fn(),
			browserContexts: [],
			defaultBrowserContext: vi.fn(),
		} as unknown as Browser;

		vi.mocked(puppeteer.launch).mockResolvedValue(mockBrowser as Browser);
		browserService = new BrowserService();
	});

	afterEach(async () => {
		await browserService.close();
		vi.clearAllMocks();
	});

	it("should initialize browser", async () => {
		await browserService.initialize();
		expect(puppeteer.launch).toHaveBeenCalledWith({
			headless: "shell",
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
	});

	it("should get new page and initialize browser if needed", async () => {
		const page = await browserService.getPage();
		expect(puppeteer.launch).toHaveBeenCalledTimes(1);
		expect(mockBrowser.newPage).toHaveBeenCalledTimes(1);
		expect(page).toBeDefined();
	});

	it("should throw error if browser initialization fails", async () => {
		vi.mocked(puppeteer.launch).mockResolvedValueOnce(
			null as unknown as Browser,
		);
		await expect(browserService.getPage()).rejects.toThrow(
			"Browser initialization failed",
		);
	});

	it("should close browser", async () => {
		await browserService.initialize();
		await browserService.close();
		expect(mockBrowser.close).toHaveBeenCalled();
	});

	it("should handle multiple page requests", async () => {
		const page1 = await browserService.getPage();
		const page2 = await browserService.getPage();

		expect(page1).toBeDefined();
		expect(page2).toBeDefined();
		expect(puppeteer.launch).toHaveBeenCalledTimes(1);
		expect(mockBrowser.newPage).toHaveBeenCalledTimes(2);
	});

	it("should handle browser initialization failure", async () => {
		const error = new Error("Launch failed");
		vi.mocked(puppeteer.launch).mockRejectedValueOnce(error);
		await expect(browserService.getPage()).rejects.toThrow(error);
	});
});
