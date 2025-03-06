import {
	cleanDate,
	decodeHtmlEntities,
	isValidLinkedInUrl,
	linkedinUrlPattern,
	processSkills,
} from "./domUtils";

describe("domUtils", () => {
	describe("linkedinUrlPattern", () => {
		it("should match valid LinkedIn profile URLs", () => {
			const validUrls = [
				"https://linkedin.com/in/username",
				"https://www.linkedin.com/in/username",
				"http://linkedin.com/in/username",
				"http://www.linkedin.com/in/username",
				"https://linkedin.com/in/user-name",
				"https://linkedin.com/in/user_name",
				"https://linkedin.com/in/username/details/experience",
				"https://linkedin.com/in/username/details/education",
				"https://linkedin.com/in/username/details/skills",
				"https://linkedin.com/in/username/details/certifications",
				"https://linkedin.com/in/username/details/projects",
				"https://linkedin.com/in/username?locale=en_US",
			];

			for (const url of validUrls) {
				expect(linkedinUrlPattern.test(url)).toBe(true);
			}
		});

		it("should not match invalid LinkedIn profile URLs", () => {
			const invalidUrls = [
				"https://linkedin.com",
				"https://linkedin.com/company/name",
				"https://linkedin.com/in/",
				"https://linkedin.com/in/username/invalid",
				"https://linkedin.com/in/username/details/invalid",
				"https://facebook.com/in/username",
				"https://linkedin.com/in/user@name",
				"https://linkedin.com/in/username?invalid=param",
				"https://linkedin.com/in/username?locale=invalid",
			];

			for (const url of invalidUrls) {
				expect(linkedinUrlPattern.test(url)).toBe(false);
			}
		});
	});

	describe("decodeHtmlEntities", () => {
		it("should decode HTML entities correctly", () => {
			expect(decodeHtmlEntities("&amp;")).toBe("&");
			expect(decodeHtmlEntities("&lt;")).toBe("<");
			expect(decodeHtmlEntities("&gt;")).toBe(">");
			expect(decodeHtmlEntities("&quot;")).toBe('"');
			expect(decodeHtmlEntities("&#039;")).toBe("'");
			expect(decodeHtmlEntities("&apos;")).toBe("'");
			expect(decodeHtmlEntities("&nbsp;")).toBe(" ");
			expect(decodeHtmlEntities("Test &amp; Example")).toBe("Test & Example");
			expect(decodeHtmlEntities("&lt;div&gt;Test&lt;/div&gt;")).toBe(
				"<div>Test</div>",
			);
		});

		it("should handle undefined and null inputs", () => {
			expect(decodeHtmlEntities(undefined)).toBe("");
			expect(decodeHtmlEntities(null)).toBe("");
		});

		it("should return the original string if no entities are present", () => {
			expect(decodeHtmlEntities("Test String")).toBe("Test String");
		});
	});

	describe("processSkills", () => {
		it("should process a single skill string", () => {
			expect(processSkills("JavaScript")).toEqual(["JavaScript"]);
		});

		it("should process multiple skills separated by middle dot", () => {
			expect(processSkills("JavaScript · TypeScript · React")).toEqual([
				"JavaScript",
				"TypeScript",
				"React",
			]);
		});

		it('should remove "Competências:" prefix', () => {
			expect(processSkills("Competências: JavaScript · TypeScript")).toEqual([
				"JavaScript",
				"TypeScript",
			]);
		});

		it("should handle array of skills", () => {
			expect(processSkills(["JavaScript", "TypeScript · React"])).toEqual([
				"JavaScript",
				"TypeScript",
				"React",
			]);
		});

		it("should handle empty strings and trim whitespace", () => {
			expect(processSkills("  JavaScript  ·  TypeScript  ")).toEqual([
				"JavaScript",
				"TypeScript",
			]);
			expect(processSkills("  ")).toEqual([]);
		});

		it("should handle undefined and null inputs", () => {
			expect(processSkills(undefined)).toEqual([]);
			expect(processSkills(null)).toEqual([]);
		});

		it("should handle null or empty items in skills array", () => {
			const skillsWithNull = ["JavaScript", null, "TypeScript", "", undefined];
			expect(processSkills(skillsWithNull as string[])).toEqual([
				"JavaScript",
				"TypeScript",
			]);
		});
	});

	describe("cleanDate", () => {
		it("should extract the first part of a date string", () => {
			expect(cleanDate("2020 · 2023")).toBe("2020");
			expect(cleanDate("Jan 2020 · Dec 2023")).toBe("Jan 2020"); // Updated expectation
			expect(cleanDate("2020")).toBe("2020");
		});

		it("should handle undefined and null inputs", () => {
			expect(cleanDate(undefined)).toBe("");
			expect(cleanDate(null)).toBe("");
		});

		it("should trim whitespace", () => {
			expect(cleanDate("  2020  · 2023")).toBe("2020");
		});
	});

	describe("isValidLinkedInUrl", () => {
		it("should validate LinkedIn URLs", () => {
			expect(isValidLinkedInUrl("https://linkedin.com/in/username")).toBe(true);
			expect(isValidLinkedInUrl("https://invalid-url.com")).toBe(false);
		});

		it("should use the linkedinUrlPattern for validation", () => {
			// This test ensures isValidLinkedInUrl uses the linkedinUrlPattern
			const testUrl = "https://linkedin.com/in/test-user";
			expect(isValidLinkedInUrl(testUrl)).toBe(
				linkedinUrlPattern.test(testUrl),
			);
		});
	});
});
