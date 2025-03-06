// Define the ProfileData interface for type safety
export interface ProfileData {
	name: string;
	headline: string;
	location: string;
	about: string;
	experience: any[];
	education: any[];
	certifications: any[];
}

export const EMPTY_PROFILE: ProfileData = {
	name: "",
	headline: "",
	location: "",
	about: "",
	experience: [],
	education: [],
	certifications: [],
};

export function hasProfileData(profile: ProfileData): boolean {
	// Actually use the profile parameter to avoid the unused variable warning
	return Boolean(profile.name || profile.headline || profile.location);
}

export function hasProfileStructure(obj: unknown): boolean {
	if (typeof obj !== "object" || obj === null) return false;

	const profile = obj as Record<string, unknown>;
	return (
		typeof profile.name === "string" &&
		typeof profile.headline === "string" &&
		typeof profile.location === "string"
	);
}

export const profileUtils = {
	EMPTY_PROFILE: {
		name: "",
		headline: "",
		location: "",
		about: "",
		experience: [],
		education: [],
		certifications: [],
	},

	hasProfileStructure: (data: unknown): boolean => {
		return !!(
			data &&
			typeof data === "object" &&
			"name" in (data as object) &&
			"headline" in (data as object) &&
			"location" in (data as object)
		);
	},

	hasProfileData: (profile: any) => {
		return !!(
			profile.name ||
			profile.headline ||
			profile.location ||
			profile.about ||
			(profile.experience && profile.experience.length > 0) ||
			(profile.education && profile.education.length > 0) ||
			(profile.certifications && profile.certifications.length > 0)
		);
	},
};
