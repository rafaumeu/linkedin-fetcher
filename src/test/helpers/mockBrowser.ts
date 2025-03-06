import type { Browser } from "puppeteer";
import { vi } from "vitest";
import type { TestBrowserService } from "../types/browserService";

/**
 * Cria um serviço de browser mockado para testes
 */
export function createMockBrowserService(): TestBrowserService {
	const mockBrowser = {
		close: vi.fn().mockResolvedValue(undefined),
		// Add other browser methods as needed
	} as unknown as Browser;

	return {
		browser: mockBrowser,
		getPage: vi.fn().mockResolvedValue({
			goto: vi.fn(),
			evaluate: vi.fn(),
		}),
		close: vi.fn().mockResolvedValue(undefined),
		initialize: vi.fn().mockResolvedValue(undefined),
		userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
	} as TestBrowserService;
}

/**
 * Configura um mock de página com comportamento personalizado
 * @param options Opções de configuração para o mock da página
 * @returns Um objeto de página mockado
 */
export function createMockPage(options: {
	evaluateResult?: any;
	gotoError?: Error;
	evaluateError?: Error;
}) {
	return {
		goto: options.gotoError
			? vi.fn().mockRejectedValue(options.gotoError)
			: vi.fn().mockResolvedValue(undefined),
		evaluate: options.evaluateError
			? vi.fn().mockRejectedValue(options.evaluateError)
			: vi.fn().mockResolvedValue(options.evaluateResult),
	};
}
