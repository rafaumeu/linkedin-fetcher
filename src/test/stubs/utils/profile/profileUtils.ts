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
	return (
		typeof obj === "object" &&
		obj !== null &&
		"name" in obj &&
		"headline" in obj &&
		"location" in obj
	);
}

export const profileUtils = {
	EMPTY_PROFILE,
	hasProfileData,
	hasProfileStructure,
};
