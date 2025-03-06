import type { ProfileData } from "../../@types/linkedin.d";
/**
 * Estrutura padrão para um perfil vazio
 */
export const EMPTY_PROFILE: ProfileData = {
	name: "",
	headline: "",
	location: "",
	about: "",
	experience: [],
	education: [],
	certifications: [],
};

/**
 * Verifica se um perfil contém dados válidos
 * @param profile Dados do perfil para verificar
 * @returns true se o perfil contém algum dado válido
 */
export function hasProfileData(profile: ProfileData): boolean {
	return (
		profile.name !== "" ||
		profile.location !== "" ||
		profile.headline !== "" ||
		(profile.experience ?? []).length > 0 ||
		(profile.education ?? []).length > 0 ||
		(profile.certifications ?? []).length > 0
	);
}

/**
 * Verifica se um objeto tem a estrutura básica de um perfil
 * @param obj Objeto a ser verificado
 * @returns true se o objeto tem a estrutura básica de um perfil
 */
export function hasProfileStructure(obj: unknown): boolean {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"name" in obj &&
		"headline" in obj &&
		"location" in obj
	);
}
