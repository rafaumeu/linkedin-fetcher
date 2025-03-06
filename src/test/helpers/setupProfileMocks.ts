import { JSDOM } from "jsdom";
import { vi } from "vitest";
import { createElement } from "./setupDomMocks";

/**
 * Interface para elementos mockados de um perfil
 */
export interface ProfileMockElements {
	nameElement: HTMLElement;
	headlineElement: HTMLElement;
	locationElement: HTMLElement;
	aboutElement: HTMLElement;
	experienceElements: HTMLElement[];
	educationElements: HTMLElement[];
	certificationElements: HTMLElement[];
}

/**
 * Cria elementos mockados para um perfil completo
 */
export function createProfileMockElements(): ProfileMockElements {
	return {
		nameElement: createElement("h1", { class: "profile-name" }, "Test Name"),
		headlineElement: createElement(
			"div",
			{ class: "profile-headline" },
			"Test Headline",
		),
		locationElement: createElement(
			"span",
			{ class: "profile-location" },
			"Test Location",
		),
		aboutElement: createElement(
			"div",
			{ class: "profile-about" },
			"Test About",
		),
		experienceElements: [
			createElement("div", { class: "experience-item" }, ""),
		],
		educationElements: [createElement("div", { class: "education-item" }, "")],
		certificationElements: [
			createElement("div", { class: "certification-item" }, ""),
		],
	};
}

/**
 * Cria elementos mockados para um perfil com dados malformados
 */
export function createMalformedProfileMockElements(): ProfileMockElements {
	const elements = createProfileMockElements();

	// Adiciona experiências malformadas
	elements.experienceElements = [
		createElement("div", { class: "experience-item valid" }, ""),
		createElement("div", { class: "experience-item empty" }, ""),
		createElement("div", { class: "experience-item malformed" }, ""),
	];

	return elements;
}

/**
 * Configura o ambiente DOM para testes de perfil
 */
export function setupProfileDOMEnvironment(elements: ProfileMockElements): {
	document: Document;
} {
	const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
	const document = dom.window.document;

	const profileContainer = document.createElement("div");
	profileContainer.id = "profile-container";

	// Adiciona elementos básicos
	profileContainer.appendChild(elements.nameElement);
	profileContainer.appendChild(elements.headlineElement);
	profileContainer.appendChild(elements.locationElement);
	profileContainer.appendChild(elements.aboutElement);

	// Adiciona seções
	const experienceSection = document.createElement("section");
	experienceSection.id = "experience-section";
	for (const el of elements.experienceElements) {
		experienceSection.appendChild(el);
	}
	profileContainer.appendChild(experienceSection);

	const educationSection = document.createElement("section");
	educationSection.id = "education-section";
	for (const el of elements.educationElements) {
		educationSection.appendChild(el);
	}
	profileContainer.appendChild(educationSection);

	const certificationSection = document.createElement("section");
	certificationSection.id = "certification-section";
	for (const el of elements.certificationElements) {
		certificationSection.appendChild(el);
	}
	profileContainer.appendChild(certificationSection);

	document.body.appendChild(profileContainer);

	return { document };
}

/**
 * Cria uma página mockada para testes de perfil
 */
export function createProfileMockPage(elements: ProfileMockElements) {
	return {
		goto: vi.fn(),
		evaluate: vi.fn().mockImplementation((fn) => {
			// Simula a extração de dados do perfil
			return {
				name: "Test Name",
				headline: "Test Headline",
				location: "Test Location",
				about: "Test About",
				experience: [
					{
						title: "Software Engineer",
						company: "Test Company",
						duration: "2020 - Present",
						location: "Test Location",
						description: "Test Description",
						skills: ["JavaScript", "TypeScript"],
					},
				],
				education: [
					{
						institution: "Test University",
						degree: "Computer Science",
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
			};
		}),
	};
}

/**
 * Cria uma página mockada para testes de perfil com dados malformados
 */
export function createMalformedProfileMockPage(elements: ProfileMockElements) {
	return {
		goto: vi.fn(),
		evaluate: vi.fn().mockImplementation((fn) => {
			// Simula a extração de dados do perfil com alguns dados malformados
			return {
				name: "Test Name",
				headline: "Test Headline",
				location: "Test Location",
				about: "Test About",
				experience: [
					{
						title: "Software Engineer",
						company: "Test Company",
						duration: "2020 - Present",
						description: "Test Description",
						skills: ["JavaScript", "TypeScript"],
					},
					{}, // Experiência vazia
					{ title: "Malformed" }, // Experiência malformada
				],
				education: [
					{
						institution: "Test University",
						degree: "Computer Science",
					},
				],
				certifications: [
					{
						name: "Test Certification",
					},
				],
			};
		}),
	};
}
