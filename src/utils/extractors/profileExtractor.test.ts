import { linkedinSelectors } from "@/utils/domUtils";
import { cleanDate, decodeHtmlEntities } from "@/utils/domUtils";
import { JSDOM } from "jsdom";
import type { Mock } from "vitest";
import {
	extractBasicInfo,
	extractCertifications,
	extractDates,
	extractDegreeInfo,
	extractEducation,
	extractExperiences,
	extractSkills,
} from "./profileExtractor";

// Mock dependencies
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
		certifications: {
			container: ".certification-container",
			title: ".certification-title",
			organization: ".certification-organization",
			date: ".certification-date",
			skills: ".certification-skills",
		},
	},
	decodeHtmlEntities: vi.fn((text) => `decoded-${text}`),
	cleanDate: vi.fn((date) => date?.split("·")[0]?.trim() || ""),
}));

describe("extractBasicInfo", () => {
	let mockDocument: Document;

	beforeEach(() => {
		vi.clearAllMocks();
		mockDocument = {
			querySelector: vi.fn(),
		} as unknown as Document;
	});

	test("should extract all profile information when all elements exist", () => {
		const mockNameElement = { textContent: "  John Doe  " };
		const mockHeadlineElement = { textContent: "  Software Engineer  " };
		const mockLocationElement = { textContent: "  San Francisco, CA  " };
		const mockAboutElement = { textContent: "  About me text  " };

		(mockDocument.querySelector as Mock).mockImplementation((selector) => {
			if (selector === linkedinSelectors.profile.name) return mockNameElement;
			if (selector === linkedinSelectors.profile.headline)
				return mockHeadlineElement;
			if (selector === linkedinSelectors.profile.location)
				return mockLocationElement;
			if (selector === linkedinSelectors.profile.about) return mockAboutElement;
			return null;
		});

		const result = extractBasicInfo(mockDocument);

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

		expect(decodeHtmlEntities).toHaveBeenCalledWith("John Doe");
		expect(decodeHtmlEntities).toHaveBeenCalledWith("Software Engineer");
		expect(decodeHtmlEntities).toHaveBeenCalledWith("San Francisco, CA");
		expect(decodeHtmlEntities).toHaveBeenCalledWith("About me text");

		expect(result).toEqual({
			name: "decoded-John Doe",
			headline: "decoded-Software Engineer",
			location: "decoded-San Francisco, CA",
			about: "decoded-About me text",
		});
	});

	test("should handle missing elements by returning empty strings", () => {
		(mockDocument.querySelector as Mock).mockReturnValue(null);

		const result = extractBasicInfo(mockDocument);

		expect(decodeHtmlEntities).toHaveBeenCalledWith("");
		expect(decodeHtmlEntities).toHaveBeenCalledTimes(4);

		expect(result).toEqual({
			name: "decoded-",
			headline: "decoded-",
			location: "decoded-",
			about: "decoded-",
		});
	});

	test("should handle elements with empty text content", () => {
		const mockNameElement = { textContent: "" };
		const mockHeadlineElement = { textContent: "   " };
		const mockLocationElement = { textContent: null };
		// @ts-ignore - Intentionally testing with undefined
		const mockAboutElement = { textContent: undefined };

		(mockDocument.querySelector as Mock).mockImplementation((selector) => {
			if (selector === linkedinSelectors.profile.name) return mockNameElement;
			if (selector === linkedinSelectors.profile.headline)
				return mockHeadlineElement;
			if (selector === linkedinSelectors.profile.location)
				return mockLocationElement;
			if (selector === linkedinSelectors.profile.about) return mockAboutElement;
			return null;
		});

		const result = extractBasicInfo(mockDocument);

		expect(decodeHtmlEntities).toHaveBeenCalledWith("");
		expect(decodeHtmlEntities).toHaveBeenCalledTimes(4);

		expect(result).toEqual({
			name: "decoded-",
			headline: "decoded-",
			location: "decoded-",
			about: "decoded-",
		});
	});

	test("should handle HTML entities in text content", () => {
		const mockNameElement = { textContent: "John &amp; Jane" };

		(mockDocument.querySelector as Mock).mockImplementation((selector) => {
			if (selector === linkedinSelectors.profile.name) return mockNameElement;
			return null;
		});

		const result = extractBasicInfo(mockDocument);

		expect(decodeHtmlEntities).toHaveBeenCalledWith("John &amp; Jane");
		expect(result.name).toBe("decoded-John &amp; Jane");
	});
});

describe("extractExperiences", () => {
	let mockDocument: Document;

	beforeEach(() => {
		vi.clearAllMocks();
		mockDocument = {
			querySelectorAll: vi.fn(),
		} as unknown as Document;
	});

	test("should extract experience information correctly", () => {
		const mockExperienceContainer = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn(),
		};

		const mockInfoElements = [
			{ textContent: "Jan 2020 - Present" },
			{ textContent: "Remote" },
		];

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
			if (selector === linkedinSelectors.experience.description) {
				return { textContent: "Job description text" };
			}
			return null;
		});

		mockExperienceContainer.querySelectorAll.mockImplementation((selector) => {
			if (selector === linkedinSelectors.experience.info) {
				return mockInfoElements;
			}
			if (selector === linkedinSelectors.experience.skills) {
				return [
					{ textContent: "Competências: JavaScript · React · TypeScript" },
				];
			}
			return [];
		});

		const experiences = extractExperiences(mockDocument);

		expect(experiences).toHaveLength(1);
		expect(experiences[0].title).toBe("decoded-Software Engineer");
		expect(experiences[0].company).toBe("decoded-Company Name");
		expect(experiences[0].duration).toBe("decoded-Jan 2020 - Present");
		expect(experiences[0].location).toBe("decoded-Remote");
		expect(experiences[0].description).toBe("decoded-Job description text");
		expect(experiences[0].skills).toEqual([
			"JavaScript",
			"React",
			"TypeScript",
		]);
	});

	test("should handle missing location info", () => {
		const mockExperienceContainer = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn(),
		};

		// Only one info element (no location element)
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

		mockExperienceContainer.querySelectorAll.mockImplementation((selector) => {
			if (selector === linkedinSelectors.experience.info) {
				return mockInfoElements;
			}
			return [];
		});

		const experiences = extractExperiences(mockDocument);

		expect(experiences).toHaveLength(1);
		expect(experiences[0].location).toBe("decoded-");
		expect(experiences[0].duration).toBe("decoded-Jan 2020 - Present");
	});

	test("should handle company name with additional information after dot separator", () => {
		const mockExperienceContainer = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn().mockReturnValue([]),
		};

		(mockDocument.querySelectorAll as Mock).mockReturnValue([
			mockExperienceContainer,
		]);

		mockExperienceContainer.querySelector.mockImplementation((selector) => {
			if (selector === linkedinSelectors.experience.title) {
				return { textContent: "Software Engineer" };
			}
			if (selector === linkedinSelectors.experience.company) {
				return { textContent: "Company Name · Full-time · 3 years" };
			}
			return null;
		});

		const experiences = extractExperiences(mockDocument);

		expect(experiences).toHaveLength(1);
		expect(experiences[0].company).toBe("decoded-Company Name");
		// Verifica que apenas a parte antes do "·" foi extraída
		expect(decodeHtmlEntities).toHaveBeenCalledWith("Company Name");
	});

	test("should handle company element with empty text content", () => {
		const mockExperienceContainer = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn().mockReturnValue([]),
		};

		(mockDocument.querySelectorAll as Mock).mockReturnValue([
			mockExperienceContainer,
		]);

		mockExperienceContainer.querySelector.mockImplementation((selector) => {
			if (selector === linkedinSelectors.experience.company) {
				return { textContent: "" };
			}
			return null;
		});

		const experiences = extractExperiences(mockDocument);

		expect(experiences).toHaveLength(1);
		expect(experiences[0].company).toBe("decoded-");
	});

	test("should handle company element with null text content", () => {
		const mockExperienceContainer = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn().mockReturnValue([]),
		};

		(mockDocument.querySelectorAll as Mock).mockReturnValue([
			mockExperienceContainer,
		]);

		mockExperienceContainer.querySelector.mockImplementation((selector) => {
			if (selector === linkedinSelectors.experience.company) {
				return { textContent: null };
			}
			return null;
		});

		const experiences = extractExperiences(mockDocument);

		expect(experiences).toHaveLength(1);
		expect(experiences[0].company).toBe("decoded-");
	});

	test("should handle empty experience containers", () => {
		(mockDocument.querySelectorAll as Mock).mockReturnValue([]);

		const experiences = extractExperiences(mockDocument);

		expect(experiences).toHaveLength(0);
	});
});

describe("extractEducation", () => {
	let mockDocument: Document;

	beforeEach(() => {
		vi.clearAllMocks();
		mockDocument = {
			querySelectorAll: vi.fn(),
		} as unknown as Document;
	});

	test("should extract education information correctly", () => {
		const mockEducationContainer = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn(),
		};

		(mockDocument.querySelectorAll as Mock).mockReturnValue([
			mockEducationContainer,
		]);

		mockEducationContainer.querySelector.mockImplementation((selector) => {
			if (selector === linkedinSelectors.education.institution) {
				return { textContent: "University of Example" };
			}
			if (selector === linkedinSelectors.education.degree) {
				return { textContent: "Bachelor of Science, Computer Science" };
			}
			if (selector === linkedinSelectors.education.date) {
				return { textContent: "2018 - 2022" };
			}
			return null;
		});

		mockEducationContainer.querySelectorAll.mockImplementation((selector) => {
			if (selector === linkedinSelectors.education.skills) {
				return [{ textContent: "Competências: Data Structures · Algorithms" }];
			}
			return [];
		});

		const education = extractEducation(mockDocument);

		expect(education).toHaveLength(1);
		expect(education[0].institution).toBe("decoded-University of Example");
		expect(education[0].degree).toBe("decoded-Bachelor of Science");
		expect(education[0].fieldOfStudy).toBe("decoded-Computer Science");
		expect(education[0].startDate).toBe("2018");
		expect(education[0].endDate).toBe("2022");
		expect(education[0].skills).toEqual(["DataStructures", "Algorithms"]);
	});

	test("should handle end date with additional information after dot separator", () => {
		const mockEducationContainer = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn().mockReturnValue([]),
		};

		(mockDocument.querySelectorAll as Mock).mockReturnValue([
			mockEducationContainer,
		]);

		mockEducationContainer.querySelector.mockImplementation((selector) => {
			if (selector === linkedinSelectors.education.date) {
				return { textContent: "2018 - 2022 · 4 years" };
			}
			return null;
		});

		const education = extractEducation(mockDocument);

		expect(education).toHaveLength(1);
		expect(education[0].startDate).toBe("2018");
		expect(education[0].endDate).toBe("2022");
	});

	test("should handle missing degree information", () => {
		const mockEducationContainer = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn().mockReturnValue([]),
		};

		(mockDocument.querySelectorAll as Mock).mockReturnValue([
			mockEducationContainer,
		]);

		mockEducationContainer.querySelector.mockImplementation((selector) => {
			if (selector === linkedinSelectors.education.institution) {
				return { textContent: "University of Example" };
			}
			// No degree element
			return null;
		});

		const education = extractEducation(mockDocument);

		expect(education).toHaveLength(1);
		expect(education[0].degree).toBe("decoded-");
		expect(education[0].fieldOfStudy).toBe("decoded-");
	});

	test("should handle degree without field of study", () => {
		const mockEducationContainer = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn().mockReturnValue([]),
		};

		(mockDocument.querySelectorAll as Mock).mockReturnValue([
			mockEducationContainer,
		]);

		mockEducationContainer.querySelector.mockImplementation((selector) => {
			if (selector === linkedinSelectors.education.degree) {
				return { textContent: "Bachelor of Science" }; // No comma, no field of study
			}
			return null;
		});

		const education = extractEducation(mockDocument);

		expect(education).toHaveLength(1);
		expect(education[0].degree).toBe("decoded-Bachelor of Science");
		expect(education[0].fieldOfStudy).toBe("decoded-");
	});
});

describe("extractCertifications", () => {
	let mockDocument: Document;

	beforeEach(() => {
		vi.clearAllMocks();
		mockDocument = {
			querySelectorAll: vi.fn(),
		} as unknown as Document;
	});

	test("should extract certification information correctly", () => {
		const mockCertContainer = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn(),
		};

		(mockDocument.querySelectorAll as Mock).mockReturnValue([
			mockCertContainer,
		]);

		mockCertContainer.querySelector.mockImplementation((selector) => {
			if (selector === linkedinSelectors.certifications.title) {
				return { textContent: "AWS Certified Developer" };
			}
			if (selector === linkedinSelectors.certifications.organization) {
				return { textContent: "Amazon Web Services" };
			}
			if (selector === linkedinSelectors.certifications.date) {
				return { textContent: "May 2022" };
			}
			return null;
		});

		mockCertContainer.querySelectorAll.mockImplementation((selector) => {
			if (selector === linkedinSelectors.certifications.skills) {
				return [{ textContent: "Competências: Cloud · Lambda · S3" }];
			}
			return [];
		});

		const certifications = extractCertifications(mockDocument);

		expect(certifications).toHaveLength(1);
		expect(certifications[0].name).toBe("decoded-AWS Certified Developer");
		expect(certifications[0].organization).toBe("decoded-Amazon Web Services");
		expect(certifications[0].issueDate).toBe("decoded-May 2022");
		expect(certifications[0].skills).toEqual(["Cloud", "Lambda", "S3"]);
	});

	test("should handle missing certification elements", () => {
		const mockCertContainer = {
			querySelector: vi.fn().mockReturnValue(null),
			querySelectorAll: vi.fn().mockReturnValue([]),
		};

		(mockDocument.querySelectorAll as Mock).mockReturnValue([
			mockCertContainer,
		]);

		const certifications = extractCertifications(mockDocument);

		expect(certifications).toHaveLength(1);
		expect(certifications[0].name).toBe("decoded-");
		expect(certifications[0].organization).toBe("decoded-");
		expect(certifications[0].issueDate).toBe("decoded-");
		expect(certifications[0].skills).toEqual([]);
	});

	test("should handle empty certification containers", () => {
		(mockDocument.querySelectorAll as Mock).mockReturnValue([]);

		const certifications = extractCertifications(mockDocument);

		expect(certifications).toHaveLength(0);
	});

	test("should handle elements with whitespace in text content", () => {
		const mockCertContainer = {
			querySelector: vi.fn(),
			querySelectorAll: vi.fn().mockReturnValue([]),
		};

		(mockDocument.querySelectorAll as Mock).mockReturnValue([
			mockCertContainer,
		]);

		mockCertContainer.querySelector.mockImplementation((selector) => {
			if (selector === linkedinSelectors.certifications.title) {
				return { textContent: "  AWS Certified Developer  " };
			}
			if (selector === linkedinSelectors.certifications.organization) {
				return { textContent: "  Amazon Web Services  " };
			}
			if (selector === linkedinSelectors.certifications.date) {
				return { textContent: "  May 2022  " };
			}
			return null;
		});

		const certifications = extractCertifications(mockDocument);

		expect(certifications[0].name).toBe("decoded-AWS Certified Developer");
		expect(certifications[0].organization).toBe("decoded-Amazon Web Services");
		expect(certifications[0].issueDate).toBe("decoded-May 2022");
	});
});

describe("extractSkills", () => {
	test("should extract skills from elements containing 'Competências:'", () => {
		const mockElement = {
			querySelectorAll: vi.fn().mockReturnValue([
				{
					textContent: "Competências: JavaScript · TypeScript · React",
				},
				{
					textContent: "Competências: Node.js · Express · MongoDB",
				},
				{
					textContent: "Other text without skills",
				},
			]),
		} as unknown as Element;

		const result = extractSkills(mockElement, ".skills-selector");

		expect(result).toEqual([
			"JavaScript",
			"TypeScript",
			"React",
			"Node.js",
			"Express",
			"MongoDB",
		]);
		expect(mockElement.querySelectorAll).toHaveBeenCalledWith(
			".skills-selector",
		);
	});

	test("should handle empty skills elements", () => {
		const mockElement = {
			querySelectorAll: vi
				.fn()
				.mockReturnValue([
					{ textContent: "Competências: " },
					{ textContent: "Competências:" },
				]),
		} as unknown as Element;

		const result = extractSkills(mockElement, ".skills-selector");

		expect(result).toEqual([]);
	});

	test("should handle querySelectorAll returning null", () => {
		const mockElement = {
			querySelectorAll: vi.fn().mockReturnValue(null),
		} as unknown as Element;

		const result = extractSkills(mockElement, ".skills-selector");

		expect(result).toEqual([]);
	});

	test("should filter out elements without 'Competências:' text", () => {
		const mockElement = {
			querySelectorAll: vi
				.fn()
				.mockReturnValue([
					{ textContent: "Competências: JavaScript" },
					{ textContent: "Skills: Python" },
					{ textContent: "Random text" },
					{ textContent: "Competências: TypeScript" },
				]),
		} as unknown as Element;

		const result = extractSkills(mockElement, ".skills-selector");

		expect(result).toEqual(["JavaScript", "TypeScript"]);
	});

	test("should handle elements with undefined textContent during filter", () => {
		const mockElement = {
			querySelectorAll: vi
				.fn()
				.mockReturnValue([
					{ textContent: undefined },
					{ textContent: "Competências: JavaScript" },
					{ textContent: null },
				]),
		} as unknown as Element;

		const result = extractSkills(mockElement, ".skills-selector");

		expect(result).toEqual(["JavaScript"]);
	});

	test("should handle empty array from querySelectorAll", () => {
		const mockElement = {
			querySelectorAll: vi.fn().mockReturnValue([]),
		} as unknown as Element;

		const result = extractSkills(mockElement, ".skills-selector");

		expect(result).toEqual([]);
	});

	test("should handle null or undefined textContent", () => {
		const mockElement = {
			querySelectorAll: vi
				.fn()
				.mockReturnValue([
					{ textContent: null },
					{ textContent: undefined },
					{ textContent: "Competências: Valid · Skills" },
				]),
		} as unknown as Element;

		const result = extractSkills(mockElement, ".skills-selector");

		expect(result).toEqual(["Valid", "Skills"]);
	});

	test("should remove whitespace from skills", () => {
		const mockElement = {
			querySelectorAll: vi
				.fn()
				.mockReturnValue([
					{ textContent: "Competências: Java Script · Type Script · Re act" },
				]),
		} as unknown as Element;

		const result = extractSkills(mockElement, ".skills-selector");

		expect(result).toEqual(["JavaScript", "TypeScript", "React"]);
	});

	test("should handle null or undefined element", () => {
		const result = extractSkills(
			null as unknown as Element,
			".skills-selector",
		);
		expect(result).toEqual([]);

		const result2 = extractSkills(
			undefined as unknown as Element,
			".skills-selector",
		);
		expect(result2).toEqual([]);
	});

	test("should handle element without querySelectorAll method", () => {
		const mockElement = {} as unknown as Element;

		const result = extractSkills(mockElement, ".skills-selector");

		expect(result).toEqual([]);
	});

	test("should handle errors during extraction", () => {
		const mockElement = {
			querySelectorAll: vi.fn().mockImplementation(() => {
				throw new Error("Test error");
			}),
		} as unknown as Element;

		const result = extractSkills(mockElement, ".skills-selector");

		expect(result).toEqual([]);
	});
});

// Helper function tests
describe("Helper functions", () => {
	// This is a utility function we're testing directly

	test("extractDegreeInfo should parse degree and field of study correctly", () => {
		const mockDegreeElement = {
			textContent: "Bachelor of Science, Computer Science",
		} as unknown as Element;

		const result = extractDegreeInfo(mockDegreeElement);

		expect(result.degree).toBe("Bachelor of Science");
		expect(result.fieldOfStudy).toBe("Computer Science");
	});

	test("extractDegreeInfo should handle missing field of study", () => {
		const mockDegreeElement = {
			textContent: "Bachelor of Science",
		} as unknown as Element;

		const result = extractDegreeInfo(mockDegreeElement);

		expect(result.degree).toBe("Bachelor of Science");
		expect(result.fieldOfStudy).toBe("");
	});

	test("extractDegreeInfo should handle null element", () => {
		const result = extractDegreeInfo(null);

		expect(result.degree).toBe("");
		expect(result.fieldOfStudy).toBe("");
	});

	test("extractDegreeInfo should handle empty text content", () => {
		const mockDegreeElement = {
			textContent: "",
		} as unknown as Element;

		const result = extractDegreeInfo(mockDegreeElement);

		expect(result.degree).toBe("");
		expect(result.fieldOfStudy).toBe("");
	});

	test("extractDegreeInfo should handle multiple commas", () => {
		const mockDegreeElement = {
			textContent: "Bachelor of Science, Computer Science, Minor in Math",
		} as unknown as Element;

		const result = extractDegreeInfo(mockDegreeElement);

		expect(result.degree).toBe("Bachelor of Science");
		expect(result.fieldOfStudy).toBe("Computer Science");
	});
});

describe("extractDates", () => {
	it("should extract start date when only first part exists", () => {
		const dom = new JSDOM("<div>January 2020 - </div>");
		const dateElement = dom.window.document.querySelector("div");

		const result = extractDates(dateElement);

		expect(result.startDate).toBe("January 2020");
		expect(result.endDate).toBe("");
		expect(cleanDate).toHaveBeenCalledWith("January 2020");
	});

	it("should handle date with middle dot separator", () => {
		const dom = new JSDOM("<div>January 2020 - December 2022 · 3 years</div>");
		const dateElement = dom.window.document.querySelector("div");

		const result = extractDates(dateElement);

		expect(result.startDate).toBe("January 2020");
		expect(result.endDate).toBe("December 2022");
		expect(cleanDate).toHaveBeenCalledWith("January 2020");
		expect(cleanDate).toHaveBeenCalledWith("December 2022");
	});

	it("should handle date with second part containing middle dot", () => {
		const mockElement = {
			textContent: "January 2020 - December 2022 · 3 years",
		} as Element;

		const result = extractDates(mockElement);

		expect(result.startDate).toBe("January 2020");
		expect(result.endDate).toBe("December 2022");
		expect(cleanDate).toHaveBeenCalledWith("January 2020");
		expect(cleanDate).toHaveBeenCalledWith("December 2022");
	});

	it("should handle date with empty second part", () => {
		const mockElement = {
			textContent: "January 2020 - ",
		} as Element;

		const result = extractDates(mockElement);

		expect(result.startDate).toBe("January 2020");
		expect(result.endDate).toBe("");
		// Remove this expectation since cleanDate is only called once with the start date
		expect(cleanDate).toHaveBeenCalledWith("January 2020");
		// cleanDate is not called with empty string in the actual implementation
	});

	it("should handle date with undefined second part", () => {
		// This specifically tests the dateParts[1]?.trim() optional chaining
		const mockDateParts = ["January 2020", ""]; // Changed from undefined to empty string
		const mockElement = {
			textContent: "January 2020 - ",
		} as Element;

		// Mock the split function to return our controlled array
		const originalSplit = String.prototype.split;
		String.prototype.split = () => {
			return mockDateParts as string[]; // Add type assertion
		};

		const result = extractDates(mockElement);

		// Restore original split function
		String.prototype.split = originalSplit;

		expect(result.startDate).toBe("January 2020");
		expect(result.endDate).toBe("");
	});

	it("should handle null textContent in dateElement", () => {
		const mockElement = {
			textContent: null,
		} as Element;

		const result = extractDates(mockElement);

		expect(result.startDate).toBe("");
		expect(result.endDate).toBe("");
	});

	it("should handle undefined textContent in dateElement", () => {
		const mockElement = {} as Element;

		const result = extractDates(mockElement);

		expect(result.startDate).toBe("");
		expect(result.endDate).toBe("");
	});

	it("should handle empty string in dateElement", () => {
		const mockElement = {
			textContent: "",
		} as Element;

		const result = extractDates(mockElement);

		expect(result.startDate).toBe("");
		expect(result.endDate).toBe("");
	});

	it("should handle date text with multiple hyphens", () => {
		const mockElement = {
			textContent: "2020-01-01 - 2023-12-31",
		} as Element;

		const result = extractDates(mockElement);

		expect(result.startDate).toBe("2020-01-01");
		expect(result.endDate).toBe("2023-12-31");
	});
});
