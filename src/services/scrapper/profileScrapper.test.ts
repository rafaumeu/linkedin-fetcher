import { LinkedinProfileScrapper } from "@/services/scrapper/profileScrapper";
import { ProfileBuilder } from "@/test/builders/ProfileBuilder";
import { createMockBrowserService } from "@/test/helpers/mockBrowser";
import { setupDomMocks } from "@/test/helpers/setupDomMocks";
import {
	createMalformedProfileMockElements,
	createMalformedProfileMockPage,
	setupProfileDOMEnvironment,
} from "@/test/helpers/setupProfileMocks";
import { profileMatchers } from "@/test/matchers/test-matchers";
import type { TestBrowserService } from "@/test/types/browserService";
import * as domUtils from "@/utils/domUtils";
import * as profileExtractor from "@/utils/extractors/profileExtractor";
import * as profileUtils from "@/utils/profile/profileUtils";

import type { ProfileData } from "@/@types/linkedin";
import type { BrowserService } from "@/services/browser/browserService";

import { expect, vi } from "vitest"; // Import expect explicitly

// Mock dos extractors no nível superior do arquivo
vi.mock("@/utils/extractors/profileExtractor");

expect.extend(profileMatchers);

describe("LinkedinProfileScrapper", () => {
	let scrapper: LinkedinProfileScrapper;
	let mockBrowserService: TestBrowserService;
	let profileBuilder: ProfileBuilder;

	beforeEach(() => {
		mockBrowserService = createMockBrowserService();
		scrapper = new LinkedinProfileScrapper(
			mockBrowserService as unknown as BrowserService,
		);
		profileBuilder = new ProfileBuilder();
		setupDomMocks();
		// Mock do localStorage
		Object.defineProperty(window, "localStorage", {
			value: {
				getItem: vi.fn(),
				setItem: vi.fn(),
				removeItem: vi.fn(),
				clear: vi.fn(),
			},
			writable: true,
		});
		Object.defineProperty(window, "sessionStorage", {
			value: {
				getItem: vi.fn(),
				setItem: vi.fn(),
				removeItem: vi.fn(),
				clear: vi.fn(),
			},
			writable: true,
		});
		expect.extend(profileMatchers); // Certifique-se de que esta linha está presente

		// Limpar todos os mocks antes de cada teste
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("processRawProfileData", () => {
		// brach 62
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
		it("should return EMPTY_PROFILE when processedData is undefined", async () => {
			const processRawProfileData = (
				scrapper as unknown as {
					processRawProfileData: (data: Partial<ProfileData>) => ProfileData;
				}
			).processRawProfileData.bind(scrapper);

			// Criar um objeto com processedData undefined
			const rawData = {
				name: undefined,
				headline: undefined,
				location: undefined,
				about: undefined,
				experience: undefined,
				education: undefined,
				certifications: undefined,
			};

			const result = processRawProfileData(rawData);

			// Verificar se retornou EMPTY_PROFILE
			expect(result).toEqual(profileUtils.EMPTY_PROFILE);

			// Verificar se cada campo está vazio
			expect(result.name).toBe("");
			expect(result.headline).toBe("");
			expect(result.location).toBe("");
			expect(result.about).toBe("");
			expect(result.experience).toEqual([]);
			expect(result.education).toEqual([]);
			expect(result.certifications).toEqual([]);
		});
		it("should return EMPTY_PROFILE when processedData is null", async () => {
			const processRawProfileData = (
				scrapper as unknown as {
					processRawProfileData: (data: Partial<ProfileData>) => ProfileData;
				}
			).processRawProfileData.bind(scrapper);

			// Cast null to Partial<ProfileData> to satisfy TypeScript
			const result = processRawProfileData({} as Partial<ProfileData>);

			expect(result).toEqual(profileUtils.EMPTY_PROFILE);
		});
	});

	describe("scrapeProfile", () => {
		// linhas 101-102,134-135
		it("should reject invalid LinkedIn URLs", async () => {
			const result = await scrapper.scrapeProfile("invalid-url");
			expect(result).toEqual({
				success: false,
				error: "URL de perfil do LinkedIn inválida",
			});
		});
		// linhas 48-49,123-124
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
		// linhas 127-128
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
		// linhas 115-116
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
		// branch 139 e 140
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
		//linha 130
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
		//linha 146
		it("should handle browser close error and continue execution", async () => {
			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			mockBrowserService.getPage = vi.fn().mockResolvedValue({
				goto: vi.fn(),
				evaluate: vi.fn().mockImplementation(() => {
					throw new Error("Test error");
				}),
			});

			mockBrowserService.close = vi
				.fn()
				.mockRejectedValue(new Error("Close error"));

			await scrapper.scrapeProfile("https://linkedin.com/in/test");

			expect(consoleErrorSpy).toHaveBeenCalledWith("Erro ao fechar o browser");
			consoleErrorSpy.mockRestore();
		});
		it("should not call close when page is null in finally block", async () => {
			// Mock getPage to throw an error immediately
			mockBrowserService.getPage = vi.fn().mockImplementation(() => {
				throw new Error("Failed to get page");
			});

			// Spy on both methods to ensure proper execution flow
			const closeSpy = vi.spyOn(mockBrowserService, "close");
			const getPageSpy = vi.spyOn(mockBrowserService, "getPage");

			// Call the actual method
			const result = await scrapper.scrapeProfile(
				"https://linkedin.com/in/test",
			);

			// Verify the error was handled
			expect(result.success).toBe(false);
			expect(result.error).toBe("Failed to get page");

			// Verify getPage was called but failed
			expect(getPageSpy).toHaveBeenCalled();

			// Verify close was not called since page remained null
			expect(closeSpy).not.toHaveBeenCalled();
		});
	});

	describe("extractProfileData", () => {
		// linhas 29-39
		it("should execute all extractors inside page.evaluate", async () => {
			// Acessar o método privado extractProfileData
			const extractProfileData = (
				scrapper as unknown as {
					extractProfileData: (page: {
						evaluate: any;
					}) => Promise<ProfileData>;
				}
			).extractProfileData.bind(scrapper);

			// Configurar os mocks para os extractors
			vi.mocked(profileExtractor.extractBasicInfo).mockReturnValue({
				name: "Test Name",
				headline: "Test Headline",
				location: "Test Location",
				about: "Test About",
			});

			vi.mocked(profileExtractor.extractExperiences).mockReturnValue([
				{
					title: "Test Experience",
					company: "Test Company",
					description: "Test Description",
					duration: "2020-Present",
					location: "Test Location",
					skills: ["JavaScript", "TypeScript"],
				},
			]);

			vi.mocked(profileExtractor.extractEducation).mockReturnValue([
				{
					institution: "Test Education",
					degree: "Test Degree",
					fieldOfStudy: "Computer Science",
					startDate: "2015",
					endDate: "2019",
					skills: ["Algorithms", "Data Structures"],
				},
			]);

			vi.mocked(profileExtractor.extractCertifications).mockReturnValue([
				{
					name: "Test Certification",
					organization: "Test Organization",
					issueDate: "2023",
					skills: ["Cloud", "DevOps"],
				},
			]);

			// Criar um mock para o método evaluate que executa a função diretamente
			const mockPage = {
				evaluate: vi.fn().mockImplementation((fn) => {
					// Executar a função diretamente
					return fn();
				}),
			};

			// Chamar o método que estamos testando
			const result = await extractProfileData(mockPage);

			// Verificar se evaluate foi chamado
			expect(mockPage.evaluate).toHaveBeenCalled();

			// Verificar se os extractors foram chamados
			expect(profileExtractor.extractBasicInfo).toHaveBeenCalledWith(document);
			expect(profileExtractor.extractExperiences).toHaveBeenCalledWith(
				document,
			);
			expect(profileExtractor.extractEducation).toHaveBeenCalledWith(document);
			expect(profileExtractor.extractCertifications).toHaveBeenCalledWith(
				document,
			);

			// Verificar o resultado
			expect(result).toEqual({
				name: "Test Name",
				headline: "Test Headline",
				location: "Test Location",
				about: "Test About",
				experience: [
					{
						title: "Test Experience",
						company: "Test Company",
						description: "Test Description",
						duration: "2020-Present",
						location: "Test Location",
						skills: ["JavaScript", "TypeScript"],
					},
				],
				education: [
					{
						institution: "Test Education",
						degree: "Test Degree",
						fieldOfStudy: "Computer Science",
						startDate: "2015",
						endDate: "2019",
						skills: ["Algorithms", "Data Structures"],
					},
				],
				certifications: [
					{
						name: "Test Certification",
						organization: "Test Organization",
						issueDate: "2023",
						skills: ["Cloud", "DevOps"],
					},
				],
			});
		});
	});
	it("should handle undefined fields in profile data", async () => {
		const processRawProfileData = (
			scrapper as unknown as {
				processRawProfileData: (data: Partial<ProfileData>) => ProfileData;
			}
		).processRawProfileData.bind(scrapper);

		// Test with undefined fields
		const result = processRawProfileData({
			name: undefined,
			headline: undefined,
			location: undefined,
			about: undefined,
			experience: undefined,
			education: undefined,
			certifications: undefined,
		});

		expect(result.name).toBe("");
		expect(result.headline).toBe("");
		expect(result.location).toBe("");
		expect(result.about).toBe("");
		expect(result.experience).toEqual([]);
		expect(result.education).toEqual([]);
		expect(result.certifications).toEqual([]);
	});

	it("should handle empty arrays in profile data", async () => {
		const processRawProfileData = (
			scrapper as unknown as {
				processRawProfileData: (data: Partial<ProfileData>) => ProfileData;
			}
		).processRawProfileData.bind(scrapper);

		// Test with empty arrays
		const result = processRawProfileData({
			name: "Test",
			headline: "Test Headline",
			location: "Test Location",
			about: "Test About",
			experience: [],
			education: [],
			certifications: [],
		});

		expect(result.name).toBe("Test");
		expect(result.experience).toEqual([]);
		expect(result.education).toEqual([]);
		expect(result.certifications).toEqual([]);
	});

	it("should handle nested undefined fields in arrays", async () => {
		const processRawProfileData = (
			scrapper as unknown as {
				processRawProfileData: (data: Partial<ProfileData>) => ProfileData;
			}
		).processRawProfileData.bind(scrapper);

		// Test with undefined nested fields
		const result = processRawProfileData({
			name: "Test",
			headline: "Test",
			location: "Test",
			experience: [
				{
					title: undefined as unknown as string,
					company: undefined as unknown as string,
					duration: undefined as unknown as string,
					description: undefined as unknown as string,
					location: undefined,
					skills: undefined,
				},
			],
			education: [
				{
					institution: undefined as unknown as string,
					degree: undefined as unknown as string,
					fieldOfStudy: undefined as unknown as string,
					startDate: undefined as unknown as string,
					endDate: undefined as unknown as string,
					skills: undefined,
				},
			],
			certifications: [
				{
					name: undefined as unknown as string,
					organization: undefined as unknown as string,
					issueDate: undefined as unknown as string,
					skills: undefined,
				},
			],
		});

		// Check that all nested fields were properly handled
		expect(result.experience[0].title).toBe("");
		expect(result.experience[0].skills).toEqual([]);
		expect(result.education[0].institution).toBe("");
		expect(result.education[0].skills).toEqual([]);
		expect(result.certifications[0].name).toBe("");
		expect(result.certifications[0].skills).toEqual([]);
	});
});
