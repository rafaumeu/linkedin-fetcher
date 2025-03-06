import type { ProfileData, ScrapingResult } from "@/@types/linkedin";

/**
 * Verifica se o resultado da raspagem de perfil foi bem-sucedido e contém os dados esperados
 * @param result O resultado da raspagem
 * @param mockDocument O documento DOM mockado para comparação
 */
export function assertSuccessfulProfileScraping(
	result: ScrapingResult<ProfileData>,
	mockDocument: Document,
): void {
	expect(result.success).toBe(true);
	expect(result.data).toBeDefined();

	if (!result.data) {
		throw new Error("Profile data is missing");
	}

	// Verifica informações básicas
	expect(result.data.name).toBe("Test Name");
	expect(result.data.headline).toBe("Test Headline");
	expect(result.data.location).toBe("Test Location");
	expect(result.data.about).toBe("Test About");

	// Verifica experiência
	expect(result.data.experience).toBeDefined();
	expect(result.data.experience.length).toBeGreaterThan(0);
	expect(result.data.experience[0].title).toBe("Software Engineer");
	expect(result.data.experience[0].company).toBe("Test Company");

	// Verifica educação
	expect(result.data.education).toBeDefined();
	expect(result.data.education.length).toBeGreaterThan(0);

	// Verifica certificações
	expect(result.data.certifications).toBeDefined();
	expect(result.data.certifications.length).toBeGreaterThan(0);
}

/**
 * Verifica se o perfil está vazio
 * @param profile O perfil a ser verificado
 */
export function assertEmptyProfile(profile: ProfileData): void {
	expect(profile.name).toBe("");
	expect(profile.headline).toBe("");
	expect(profile.location).toBe("");
	expect(profile.about).toBe("");
	expect(profile.experience).toEqual([]);
	expect(profile.education).toEqual([]);
	expect(profile.certifications).toEqual([]);
}
