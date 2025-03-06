import type { BrowserService } from "@/services/browser/browserService";
import type { Page } from "puppeteer";
import type { Mock } from "vitest";

/**
 * Interface estendida do BrowserService para testes
 * Facilita a criação de mocks com métodos específicos para testes
 */
export interface TestBrowserService extends Omit<BrowserService, "browser"> {
	getPage: Mock;
	close: Mock;
	initialize: Mock;
	userAgent: string;
}
