import { LinkedinProfileScrapper } from "@/services/scrapper/profileScrapper";
import { ProfileBuilder } from "@/test/builders/ProfileBuilder";
import { createMockProfile } from "@/test/factories/profileData";
import { createMockBrowserService } from "@/test/helpers/mockBrowser";
import { setupDomMocks } from "@/test/helpers/setupDomMocks";
import {
	createMalformedProfileMockElements,
	createMalformedProfileMockPage,
	createProfileMockElements,
	createProfileMockPage,
	setupProfileDOMEnvironment,
} from "@/test/helpers/setupProfileMocks";
import { profileMatchers } from "@/test/matchers/test-matchers";
import type { TestBrowserService } from "@/test/types/browserService";
import * as domUtils from "@/utils/domUtils";
import * as profileUtils from "@/utils/profile/profileUtils";

import { assertSuccessfulProfileScraping } from "@/test/helpers/assertProfile";
import { ProfileNotFoundError } from "@/utils/errors/AppError";
import { vi } from "vitest";

describe("LinkedinProfileScrapper", () => {
	let scrapper: LinkedinProfileScrapper;
	let mockBrowserService: TestBrowserService;
	let profileBuilder: ProfileBuilder;

	beforeEach(() => {
		mockBrowserService = createMockBrowserService();
		scrapper = new LinkedinProfileScrapper(mockBrowserService);
		profileBuilder = new ProfileBuilder();
		setupDomMocks();
		expect.extend(profileMatchers);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("processRawProfileData", () => {
		it("should process raw profile data correctly", async () => {
			const processRawProfileData = (
				scrapper as unknown as {
					processRawProfileData: (data: Partial<ProfileData>) => ProfileData;
				}
			).processRawProfileData.bind(scrapper);

			const cleanDateSpy = vi
				.spyOn(domUtils, "cleanDate")
				.mockImplementation((date: string | null | undefined): string => {
					if (date === "01/2015") return "2015";
					if (date === "12/2019") return "2019";
					return date || "";
				});

			const rawData = {
				name: "Test &amp; Name",
				headline: "Test &lt;Dev&gt;",
				location: "Test &quot;Location&quot;",
				about: "Test &apos;About&apos;",
				experience: [
					{
						title: "Senior &amp; Developer",
						company: "Test &lt;Company&gt;",
						duration: "2020 &quot;Present&quot;",
						location: "Remote &apos;Work&apos;",
						description: "Test Description",
						skills: ["JavaScript", "TypeScript"],
					},
				],
				education: [
					{
						institution: "Test &amp; University",
						degree: "Test &lt;Degree&gt;",
						fieldOfStudy: "Computer Science",
						startDate: "01/2015",
						endDate: "12/2019",
						skills: ["Algorithms", "Data Structures"],
					},
				],
				certifications: [
					{
						name: "Test &amp; Certification",
						organization: "Test &lt;Org&gt;",
						issueDate: "2023",
						skills: ["Cloud", "DevOps"],
					},
				],
			};

			const result = processRawProfileData(rawData);

			expect(result.name).toBe("Test & Name");
			expect(result.headline).toBe("Test <Dev>");
			expect(result.location).toBe('Test "Location"');
			expect(result.about).toBe("Test 'About'");

			expect(result.experience?.[0]?.title).toBe("Senior & Developer");
			expect(result.experience?.[0].company).toBe("Test <Company>");
			expect(result.experience?.[0].duration).toBe('2020 "Present"');

			expect(result.education?.[0].institution).toBe("Test & University");
			expect(result.education?.[0].degree).toBe("Test <Degree>");
			expect(result.education?.[0].startDate).toBe("2015");
			expect(result.education?.[0].endDate).toBe("2019");

			expect(result.certifications?.[0].name).toBe("Test & Certification");
			expect(result.certifications?.[0].organization).toBe("Test <Org>");

			cleanDateSpy.mockRestore();
		});

		it("should handle null or undefined data", async () => {
			const processRawProfileData = (
				scrapper as unknown as {
					processRawProfileData: (data: Partial<ProfileData>) => ProfileData;
				}
			).processRawProfileData.bind(scrapper);

			const resultUndefined = processRawProfileData({} as Partial<ProfileData>);
			expect(resultUndefined).toEqual(
				expect.objectContaining({
					name: "",
					headline: "",
					location: "",
					about: "",
					experience: [],
					education: [],
					certifications: [],
				}),
			);

			const resultNull = processRawProfileData({} as Partial<ProfileData>);
			expect(resultNull).toEqual(
				expect.objectContaining({
					name: "",
					headline: "",
					location: "",
					about: "",
					experience: [],
					education: [],
					certifications: [],
				}),
			);
		});
	});

	describe("result creation methods", () => {
		it("should create success result correctly", () => {
			const createSuccessResult = (
				scrapper as unknown as {
					createSuccessResult: (data: ProfileData) => {
						success: boolean;
						data: ProfileData;
					};
				}
			).createSuccessResult.bind(scrapper);
			const mockData = {
				name: "Test",
				headline: "",
				location: "",
				about: "",
				experience: [],
				education: [],
				certifications: [],
			};

			const result = createSuccessResult(mockData);

			expect(result).toEqual({
				success: true,
				data: mockData,
			});
		});

		it("should create error result correctly", () => {
			const createErrorResult = (
				scrapper as unknown as {
					createErrorResult: (message: string) => {
						success: boolean;
						error: string;
					};
				}
			).createErrorResult.bind(scrapper);
			const errorMessage = "Test error message";

			const result = createErrorResult(errorMessage);

			expect(result).toEqual({
				success: false,
				error: errorMessage,
			});
		});
	});

	describe("scrapeProfile", () => {
		it("should reject invalid LinkedIn URLs", async () => {
			const result = await scrapper.scrapeProfile("invalid-url");
			expect(result).toEqual({
				success: false,
				error: "URL de perfil do LinkedIn inválida",
			});
		});

		it("should handle navigation errors", async () => {
			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn().mockRejectedValue(new Error("Network error")),
				evaluate: vi.fn(),
			});

			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/test",
			);
			expect(result).toEqual({
				success: false,
				error: "Network error",
			});
		});

		it("should handle empty profiles", async () => {
			const emptyProfile = {
				name: "",
				headline: "",
				location: "",
				about: "",
				experience: [],
				education: [],
				certifications: [],
			};

			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockImplementation(() => emptyProfile),
			});

			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/test",
			);
			expect(result.success).toBe(true);
			expect(result.data).toEqual(emptyProfile);
		});

		it("should successfully scrape a complete profile", async () => {
			const profile = profileBuilder.build();

			const scrapingFunction = () => profile;

			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockImplementation((fn) => scrapingFunction()),
			});
			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/test",
			);

			expect(result.success).toBe(true);
			expect(result.data).toEqual(profile);
		});

		it("should handle HTML entities in profile data", async () => {
			const mockProfile = createMockProfile({
				name: domUtils.decodeHtmlEntities("Test &amp; Name"),
				headline: domUtils.decodeHtmlEntities("Test &lt;Dev&gt;"),
				location: domUtils.decodeHtmlEntities("Test &quot;Location&quot;"),
				about: domUtils.decodeHtmlEntities("Test &apos;About&apos;"),
			});

			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockResolvedValue(mockProfile),
			});

			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/test",
			);
			expect(result.success).toBe(true);
			expect(result.data?.name).toBe("Test & Name");
			expect(result.data?.headline).toBe("Test <Dev>");
			expect(result.data?.location).toBe('Test "Location"');
			expect(result.data?.about).toBe("Test 'About'");
		});

		it("should handle undefined processed data", async () => {
			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockResolvedValue(undefined),
			});

			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/test-undefined",
			);

			expect(result.success).toBe(true);
			expect(result.data).toEqual({
				name: "",
				headline: "",
				location: "",
				about: "",
				experience: [],
				education: [],
				certifications: [],
			});
		});

		it("should handle null processed data", async () => {
			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockResolvedValue(null),
			});

			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/test-null",
			);

			expect(result.success).toBe(true);
			expect(result.data).toEqual({
				name: "",
				headline: "",
				location: "",
				about: "",
				experience: [],
				education: [],
				certifications: [],
			});
		});

		it("should handle blocked or non-extractable profiles", async () => {
			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockResolvedValue({}),
			});

			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/blocked-profile",
			);

			expect(result.success).toBe(true);
			expect(result.data).toEqual({
				name: "",
				headline: "",
				location: "",
				about: "",
				experience: [],
				education: [],
				certifications: [],
			});
		});

		it("should handle DOM scraping", async () => {
			const mockElements = createProfileMockElements();
			const { document: mockDocument } =
				setupProfileDOMEnvironment(mockElements);

			mockBrowserService.getPage = vi
				.fn()
				.mockResolvedValue(createProfileMockPage(mockElements));

			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/test",
			);

			assertSuccessfulProfileScraping(result, mockDocument);
		});

		it("should handle DOM scraping with missing or malformed data", async () => {
			const mockElements = createMalformedProfileMockElements();
			const { document: mockDocument } =
				setupProfileDOMEnvironment(mockElements);

			mockBrowserService.getPage = vi
				.fn()
				.mockResolvedValue(createMalformedProfileMockPage(mockElements));

			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/test",
			);

			expect(result.success).toBe(true);
			expect(result.data).toBeDefined();

			if (!result.data) {
				throw new Error("Profile data is missing");
			}

			if (!result.data.experience) {
				throw new Error("Profile experience is missing");
			}

			expect(result.data.experience).toHaveLength(3);

			expect(result.data.name).toBe("Test Name");
			expect(result.data.headline).toBe("Test Headline");
			expect(result.data.location).toBe("Test Location");
			expect(result.data.about).toBe("Test About");

			const firstExperience = result.data.experience[0];
			expect(firstExperience.title).toBe("Software Engineer");
			expect(firstExperience.company).toBe("Test Company");
			expect(firstExperience.duration).toBe("2020 - Present");
			expect(firstExperience.description).toBe("Test Description");

			if (!firstExperience.skills) {
				throw new Error("Experience skills are missing");
			}

			const skillsString = firstExperience.skills.join(" ");
			expect(skillsString).toContain("JavaScript");
			expect(skillsString).toContain("TypeScript");

			expect(result.data.experience[1]).toBeEmptyExperience();
			expect(result.data.experience[2]).toBeEmptyExperience();
		});

		it("should handle ProfileNotFoundError", async () => {
			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockImplementation(() => {
					throw new ProfileNotFoundError("https://linkedin.com/in/not-found");
				}),
			});

			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/not-found",
			);

			expect(result.success).toBe(false);
			expect(result.error).toContain("not-found");
		});

		it("should handle case where hasProfileStructure returns false", async () => {
			const spyHasProfileData = vi
				.spyOn(profileUtils, "hasProfileData")
				.mockReturnValue(false);
			const spyHasProfileStructure = vi
				.spyOn(profileUtils, "hasProfileStructure")
				.mockReturnValue(false);

			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockResolvedValue({
					name: "",
					headline: "",
					location: "",
				}),
			});

			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/test-structure",
			);

			expect(result.success).toBe(false);
			expect(result.error).toBe("Profile not found");

			spyHasProfileData.mockRestore();
			spyHasProfileStructure.mockRestore();
		});

		it("should handle empty processed data with Object.keys check", async () => {
			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockResolvedValue({}),
			});

			const originalObjectKeys = Object.keys;
			Object.keys = vi.fn().mockReturnValue([]);

			try {
				const result = await scrapper.scrapeProfile(
					"https://linkedin.com/in/test",
				);

				expect(result.success).toBe(false);

				expect(result.error).toContain("Profile not found");

				expect(Object.keys).toHaveBeenCalled();
			} finally {
				Object.keys = originalObjectKeys;
			}
		});

		it("should handle browser close error in finally block", async () => {
			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockResolvedValue({}),
			});

			mockBrowserService.close = vi
				.fn()
				.mockRejectedValue(new Error("Failed to close browser"));

			await scrapper.scrapeProfile("https://linkedin.com/in/test");

			expect(consoleErrorSpy).toHaveBeenCalledWith("Erro ao fechar o browser");

			consoleErrorSpy.mockRestore();
		});
		it("should handle unknown error", async () => {
			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockRejectedValue("Unknown error"),
			});

			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/test",
			);

			expect(result.success).toBe(false);
			expect(result.error).toBe("Erro desconhecido");
		});
		it("should handle case where both hasProfileData and hasProfileStructure are false", async () => {
			const spyHasProfileData = vi
				.spyOn(profileUtils, "hasProfileData")
				.mockReturnValue(false);
			const spyHasProfileStructure = vi
				.spyOn(profileUtils, "hasProfileStructure")
				.mockReturnValue(false);

			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockResolvedValue({
					name: "Test",
					headline: "Test",
				}),
			});

			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/test",
			);

			expect(result.success).toBe(false);
			expect(result.error).toBe("Profile not found");

			spyHasProfileData.mockRestore();
			spyHasProfileStructure.mockRestore();
		});
		it("should handle experience with undefined skills", async () => {
			const mockData = {
				name: "Test Name",
				headline: "Test Headline",
				location: "Test Location",
				about: "Test About",
				experience: [
					{
						title: "Test Title",
						company: "Test Company",
						duration: "Test Duration",
						location: "Test Location",
						description: "Test Description",
						skills: undefined,
					},
				],
				education: [],
				certifications: [],
			};

			const processRawProfileData = (
				scrapper as unknown as {
					processRawProfileData: (data: ProfileData) => ProfileData;
				}
			).processRawProfileData.bind(scrapper);
			const result = processRawProfileData(mockData);

			expect(result.experience?.[0].skills).toEqual([]);
		});

		it("should handle education with undefined skills", async () => {
			const mockData = {
				name: "Test Name",
				headline: "Test Headline",
				location: "Test Location",
				about: "Test About",
				experience: [],
				education: [
					{
						institution: "Test Institution",
						degree: "Test Degree",
						fieldOfStudy: "Test Field",
						startDate: "2020",
						endDate: "2024",
						skills: undefined,
					},
				],
				certifications: [],
			};

			const processRawProfileData = (
				scrapper as unknown as {
					processRawProfileData: (data: ProfileData) => ProfileData;
				}
			).processRawProfileData.bind(scrapper);
			const result = processRawProfileData(mockData);

			expect(result.education?.[0].skills).toEqual([]);
		});

		it("should handle certifications with undefined skills", async () => {
			const mockData = {
				name: "Test Name",
				headline: "Test Headline",
				location: "Test Location",
				about: "Test About",
				experience: [],
				education: [],
				certifications: [
					{
						name: "Test Certification",
						organization: "Test Organization",
						issueDate: "2023",
						skills: undefined,
					},
				],
			};

			const processRawProfileData = (
				scrapper as unknown as {
					processRawProfileData: (data: ProfileData) => ProfileData;
				}
			).processRawProfileData.bind(scrapper);
			const result = processRawProfileData(mockData);

			expect(result.certifications?.[0].skills).toEqual([]);
		});
	});
});
