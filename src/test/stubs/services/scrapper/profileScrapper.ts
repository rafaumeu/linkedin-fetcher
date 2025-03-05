import { profileUtils } from "@/test/stubs/utils/profile/profileUtils";
import type { ProfileData } from "@/test/stubs/utils/profile/profileUtils";

export class LinkedinProfileScrapper {
	async scrapeProfile(url: string) {
		if (!url.includes("linkedin.com")) {
			return { success: false, error: "Invalid LinkedIn profile URL" };
		}
		return { success: true, data: profileUtils.EMPTY_PROFILE };
	}

	async processRawProfileData(data: any): Promise<ProfileData> {
		return profileUtils.EMPTY_PROFILE;
	}

	async extractProfileData() {
		return {};
	}
}
