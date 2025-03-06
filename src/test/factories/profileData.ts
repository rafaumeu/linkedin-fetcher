import type { ProfileData } from "@/@types/linkedin";

/**
 * Cria um perfil mockado com dados padrão que podem ser sobrescritos
 * @param overrides Dados para sobrescrever os valores padrão
 * @returns Um objeto ProfileData completo
 */
export function createMockProfile(
	overrides: Partial<ProfileData> = {},
): ProfileData {
	return {
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
				skills: ["JavaScript", "TypeScript"],
			},
		],
		education: [
			{
				institution: "Test Institution",
				degree: "Test Degree",
				fieldOfStudy: "Test Field",
				startDate: "2020",
				endDate: "2024",
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
		...overrides,
	};
}

/**
 * Cria um perfil vazio para testes
 * @returns Um objeto ProfileData vazio
 */
export function createEmptyProfile(): ProfileData {
	return {
		name: "",
		headline: "",
		location: "",
		about: "",
		experience: [],
		education: [],
		certifications: [],
	};
}
