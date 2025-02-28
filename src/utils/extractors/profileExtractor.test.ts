import { linkedinSelectors } from "@/utils/domUtils";
import { decodeHtmlEntities } from "@/utils/domUtils";
import type { Mock } from "vitest";
import {
	extractBasicInfo,
	extractEducation,
	extractExperiences,
} from "./profileExtractor";

// Mock dependencies
// Update the mock to include all necessary selectors
vi.mock("@/utils/domUtils", () => ({
	linkedinSelectors: {
		profile: {
			name: ".profile-name",
			headline: ".profile-headline",
			location: ".profile-location",
			about: ".profile-about",
		},
		experience: {
			container: ".experience-container",
			title: ".experience-title",
			company: ".experience-company",
			info: ".experience-info",
			description: ".experience-description",
			skills: ".experience-skills",
		},
		education: {
			container: ".education-container",
			institution: ".education-institution",
			degree: ".education-degree",
			date: ".education-date",
			skills: ".education-skills",
		},
	},
	decodeHtmlEntities: vi.fn((text) => `decoded-${text}`),
	cleanDate: vi.fn((date) => date?.split("·")[0]?.trim() || ""),
}));

describe("extractBasicInfo", () => {
	let mockDocument: Document;

	beforeEach(() => {
		// Reset mocks
		vi.clearAllMocks();

		// Create a mock document with both querySelector and querySelectorAll
		mockDocument = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn(),
		} as unknown as Document;
	});

	test("should extract all profile information when all elements exist", () => {
		// Setup mock elements
		const mockNameElement = { textContent: "  John Doe  " };
		const mockHeadlineElement = { textContent: "  Software Engineer  " };
		const mockLocationElement = { textContent: "  San Francisco, CA  " };
		const mockAboutElement = { textContent: "  About me text  " };

		// Configure mock to return different elements based on selector
		(mockDocument.querySelector as Mock).mockImplementation((selector) => {
			if (selector === linkedinSelectors.profile.name) return mockNameElement;
			if (selector === linkedinSelectors.profile.headline)
				return mockHeadlineElement;
			if (selector === linkedinSelectors.profile.location)
				return mockLocationElement;
			if (selector === linkedinSelectors.profile.about) return mockAboutElement;
			return null;
		});

		// Call the function
		const result = extractBasicInfo(mockDocument);

		// Verify document.querySelector was called with correct selectors
		expect(mockDocument.querySelector).toHaveBeenCalledWith(
			linkedinSelectors.profile.name,
		);
		expect(mockDocument.querySelector).toHaveBeenCalledWith(
			linkedinSelectors.profile.headline,
		);
		expect(mockDocument.querySelector).toHaveBeenCalledWith(
			linkedinSelectors.profile.location,
		);
		expect(mockDocument.querySelector).toHaveBeenCalledWith(
			linkedinSelectors.profile.about,
		);

		// Verify decodeHtmlEntities was called with trimmed text
		expect(decodeHtmlEntities).toHaveBeenCalledWith("John Doe");
		expect(decodeHtmlEntities).toHaveBeenCalledWith("Software Engineer");
		expect(decodeHtmlEntities).toHaveBeenCalledWith("San Francisco, CA");
		expect(decodeHtmlEntities).toHaveBeenCalledWith("About me text");

		// Verify the result
		expect(result).toEqual({
			name: "decoded-John Doe",
			headline: "decoded-Software Engineer",
			location: "decoded-San Francisco, CA",
			about: "decoded-About me text",
		});
	});

	test("should handle missing elements by returning empty strings", () => {
		// Configure mock to return null for all selectors
		(mockDocument.querySelector as Mock).mockReturnValue(null);

		// Call the function
		const result = extractBasicInfo(mockDocument);

		// Verify decodeHtmlEntities was called with empty strings
		expect(decodeHtmlEntities).toHaveBeenCalledWith("");
		expect(decodeHtmlEntities).toHaveBeenCalledTimes(4);

		// Verify the result
		expect(result).toEqual({
			name: "decoded-",
			headline: "decoded-",
			location: "decoded-",
			about: "decoded-",
		});
	});

	test("should handle elements with empty text content", () => {
		// Setup mock elements with empty text
		const mockNameElement = { textContent: "" };
		const mockHeadlineElement = { textContent: "   " };
		const mockLocationElement = { textContent: null };
		// @ts-ignore - Intentionally testing with undefined
		const mockAboutElement = { textContent: undefined };

		// Configure mock to return different elements based on selector
		(mockDocument.querySelector as Mock).mockImplementation((selector) => {
			if (selector === linkedinSelectors.profile.name) return mockNameElement;
			if (selector === linkedinSelectors.profile.headline)
				return mockHeadlineElement;
			if (selector === linkedinSelectors.profile.location)
				return mockLocationElement;
			if (selector === linkedinSelectors.profile.about) return mockAboutElement;
			return null;
		});

		// Call the function
		const result = extractBasicInfo(mockDocument);

		// Verify decodeHtmlEntities was called with empty strings
		expect(decodeHtmlEntities).toHaveBeenCalledWith("");
		expect(decodeHtmlEntities).toHaveBeenCalledTimes(4);

		// Verify the result
		expect(result).toEqual({
			name: "decoded-",
			headline: "decoded-",
			location: "decoded-",
			about: "decoded-",
		});
	});

	test("should handle HTML entities in text content", () => {
		// Setup mock with HTML entities
		const mockNameElement = { textContent: "John &amp; Jane" };

		// Configure mock to return element only for name
		(mockDocument.querySelector as Mock).mockImplementation((selector) => {
			if (selector === linkedinSelectors.profile.name) return mockNameElement;
			return null;
		});

		// Call the function
		const result = extractBasicInfo(mockDocument);

		// Verify decodeHtmlEntities was called with the HTML entity text
		expect(decodeHtmlEntities).toHaveBeenCalledWith("John &amp; Jane");

		// Verify the result
		expect(result.name).toBe("decoded-John &amp; Jane");
	});
	describe("extractExperiences", () => {
		let mockDocument: Document;

		beforeEach(() => {
			mockDocument = {
				querySelectorAll: vi.fn(),
			} as unknown as Document;
		});

		it("should handle missing location info", () => {
			const mockExperienceContainer = {
				querySelector: vi.fn(),
				querySelectorAll: vi.fn(),
			};

			// Mock apenas um elemento de info (sem o elemento de localização)
			const mockInfoElements = [{ textContent: "Jan 2020 - Present" }];

			(mockDocument.querySelectorAll as Mock).mockReturnValue([
				mockExperienceContainer,
			]);
			mockExperienceContainer.querySelector.mockImplementation((selector) => {
				if (selector === linkedinSelectors.experience.title) {
					return { textContent: "Software Engineer" };
				}
				if (selector === linkedinSelectors.experience.company) {
					return { textContent: "Company Name" };
				}
				return null;
			});
			mockExperienceContainer.querySelectorAll.mockImplementation(
				(selector) => {
					if (selector === linkedinSelectors.experience.info) {
						return mockInfoElements;
					}
					return [];
				},
			);

			const experiences = extractExperiences(mockDocument);

			expect(experiences).toHaveLength(1);
			expect(experiences[0].location).toBe("decoded-");
			expect(experiences[0].duration).toBe("decoded-Jan 2020 - Present");
		});
		it("should handle missing company information", () => {
			const mockDocument = {
				querySelectorAll: vi.fn().mockReturnValue([
					{
						querySelector: (selector: string) => {
							if (selector === linkedinSelectors.experience.company) {
								return { textContent: "  " }; // Empty company text
							}
							return {
								textContent: "Some text",
							};
						},
						querySelectorAll: () => [
							{
								textContent: "Duration",
							},
							{
								textContent: "Location",
							},
						],
					},
				]),
			} as unknown as Document;

			const result = extractExperiences(mockDocument);
			expect(result[0].company).toBe("decoded-"); // Corrigido para 'decoded-' em vez de ''
		});
	});
	it("should handle end date with additional information after dot separator", () => {
		const educationContainer = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn().mockReturnValue([]),
		};

		// Create a date element with additional info after the end date
		const dateElement = {
			textContent: "2018 - 2022 · 4 years",
		};

		(mockDocument.querySelectorAll as Mock).mockReturnValue([
			educationContainer,
		]);

		educationContainer.querySelector = vi
			.fn()
			.mockImplementation((selector) => {
				if (selector === linkedinSelectors.education.date) {
					return dateElement;
				}
				return null;
			});

		const education = extractEducation(mockDocument);

		expect(education).toHaveLength(1);
		expect(education[0].startDate).toBe("2018");
		expect(education[0].endDate).toBe("2022"); // Should extract only "2022" without the "· 4 years" part
	});
});
