import type { ProfileData } from "@/@types/linkedin";
import {
	EMPTY_PROFILE,
	hasProfileData,
	hasProfileStructure,
} from "./profileUtils";

describe("profileUtils", () => {
	describe("hasProfileData", () => {
		it("should return true when profile has a name", () => {
			const profile: ProfileData = {
				...EMPTY_PROFILE,
				name: "John Doe",
			};
			expect(hasProfileData(profile)).toBe(true);
		});

		it("should return true when profile has a location", () => {
			const profile: ProfileData = {
				...EMPTY_PROFILE,
				location: "New York",
			};
			expect(hasProfileData(profile)).toBe(true);
		});

		it("should return true when profile has a headline", () => {
			const profile: ProfileData = {
				...EMPTY_PROFILE,
				headline: "Software Engineer",
			};
			expect(hasProfileData(profile)).toBe(true);
		});

		// Tests for the branches in lines 26-28
		it("should return true when profile has experience items", () => {
			const profile: ProfileData = {
				...EMPTY_PROFILE,
				experience: [
					{
						title: "Developer",
						company: "Tech Co",
						duration: "2 years",
						location: "Remote",
						description: "",
						skills: [],
					},
				],
			};
			expect(hasProfileData(profile)).toBe(true);
		});

		it("should return true when profile has education items", () => {
			const profile: ProfileData = {
				...EMPTY_PROFILE,
				education: [
					{
						institution: "University",
						degree: "BS",
						fieldOfStudy: "Computer Science",
						startDate: "2018",
						endDate: "2022",
						skills: [],
					},
				],
			};
			expect(hasProfileData(profile)).toBe(true);
		});

		it("should return true when profile has certification items", () => {
			const profile: ProfileData = {
				...EMPTY_PROFILE,
				certifications: [
					{
						name: "AWS Certified",
						organization: "Amazon",
						issueDate: "2023",
						skills: [],
					},
				],
			};
			expect(hasProfileData(profile)).toBe(true);
		});

		it("should handle undefined arrays with nullish coalescing operator", () => {
			// Test with undefined arrays to cover the nullish coalescing operator (??)
			const profile = {
				name: "",
				headline: "",
				location: "",
				about: "",
				// Intentionally omitting the arrays to test the ?? operator
			} as ProfileData;

			expect(hasProfileData(profile)).toBe(false);
		});

		it("should return false for an empty profile", () => {
			expect(hasProfileData(EMPTY_PROFILE)).toBe(false);
		});
	});

	describe("hasProfileStructure", () => {
		it("should return true for objects with the basic profile structure", () => {
			const obj = {
				name: "",
				headline: "",
				location: "",
			};
			expect(hasProfileStructure(obj)).toBe(true);
		});

		it("should return false for null", () => {
			expect(hasProfileStructure(null)).toBe(false);
		});

		it("should return false for non-objects", () => {
			expect(hasProfileStructure("string")).toBe(false);
			expect(hasProfileStructure(123)).toBe(false);
		});

		it("should return false for objects missing required properties", () => {
			expect(hasProfileStructure({ name: "", headline: "" })).toBe(false);
			expect(hasProfileStructure({ name: "", location: "" })).toBe(false);
			expect(hasProfileStructure({ headline: "", location: "" })).toBe(false);
		});
	});
});
