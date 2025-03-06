describe("Test Setup", () => {
	it("should use fake timers in tests", () => {
		expect(vi.isFakeTimers()).toBe(true);
	});

	it("should restore real timers after all tests", () => {
		afterAll(() => {
			expect(vi.isFakeTimers()).toBe(false);
		});
	});

	it("should properly mock Date.now()", () => {
		const now = Date.now();
		vi.setSystemTime(new Date(2024, 0, 1));
		expect(Date.now()).toBe(new Date(2024, 0, 1).getTime());
		vi.setSystemTime(now);
	});
});

// Remove unused beforeAll import
import { describe, expect, test } from "vitest";

describe("Setup Tests", () => {
	test("environment should be test", () => {
		expect(process.env.NODE_ENV).toBe("test");
	});
});
