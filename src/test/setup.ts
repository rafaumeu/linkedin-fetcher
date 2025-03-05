import { setupDomMocks } from "@/test/helpers/setupDomMocks";
import { profileMatchers } from "@/test/matchers/test-matchers";
import { JSDOM } from "jsdom";
import { vi } from "vitest";

// Setup DOM environment
setupDomMocks();

// Enable fake timers for all tests
vi.useFakeTimers();

// Register custom matchers
expect.extend(profileMatchers);

// Setup DOM environment for tests
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
	url: "http://localhost",
	pretendToBeVisual: true,
});

// Set up global objects
global.document = dom.window.document;
global.window = dom.window as any;

// Fix navigator assignment
Object.defineProperty(global, "navigator", {
	value: {
		userAgent: "node.js",
	},
	writable: true,
});

// Add any other globals needed for tests
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;

// Mock para console.error para evitar poluição nos logs de teste
vi.spyOn(console, "error").mockImplementation(() => {});

// Limpa todos os mocks após cada teste
afterEach(() => {
	vi.clearAllMocks();
});
