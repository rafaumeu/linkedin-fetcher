import { http, HttpResponse } from "msw";

/**
 * Mock API handlers for testing
 * Add your API mocks here
 */
export const handlers = [
	// Example handler for LinkedIn API
	http.get("https://api.linkedin.com/v2/me", () => {
		return HttpResponse.json({
			id: "test-user-id",
			firstName: {
				localized: {
					en_US: "Test",
				},
			},
			lastName: {
				localized: {
					en_US: "User",
				},
			},
			profilePicture: {
				displayImage: "test-image-url",
			},
		});
	}),

	// Example handler for profile data
	http.get<{ username: string }, never>(
		"https://www.linkedin.com/in/:username",
		({ params }) => {
			return HttpResponse.json({
				name: "Test User",
				headline: "Software Engineer",
				location: "Remote",
				about: "Test profile for API mocking",
				experience: [],
				education: [],
				certifications: [],
			});
		},
	),
];
