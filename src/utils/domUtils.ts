export const linkedinUrlPattern =
	/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+(?:\/details\/(?:experience|education|skills|certifications|projects)|\/)?(?:\?locale=[a-z]{2}_[A-Z]{2})?$/;

export const linkedinSelectors = {
	experience: {
		container: "li.pvs-list__paged-list-item",
		title: '.mr1.t-bold span[aria-hidden="true"]',
		company: '.t-14.t-normal span[aria-hidden="true"]:first-child',
		info: '.t-black--light span[aria-hidden="true"]',
		description:
			'.pvs-list__item--with-top-padding .t-14.t-normal.t-black span[aria-hidden="true"]',
		skills: 'span[aria-hidden="true"]',
	},
	education: {
		container: '.mr1.hoverable-link-text.t-bold span[aria-hidden="true"]',
		institution: '.mr1.hoverable-link-text.t-bold span[aria-hidden="true"]',
		degree: '.t-14.t-normal span[aria-hidden="true"]:first-child',
		date: '.t-black--light span[aria-hidden="true"]',
		skills: 'span[aria-hidden="true"]',
	},
	certifications: {
		container: ".pvs-list__paged-list-item.artdeco-list__item",
		title: '.hoverable-link-text.t-bold span[aria-hidden="true"]',
		organization:
			"div.display-flex.flex-column.align-self-center.flex-grow-1 > div.display-flex.flex-row.justify-space-between > a > span:nth-child(2) > span:nth-child(1)",
		date: '.t-black--light span[aria-hidden="true"]',
		skills: 'span[aria-hidden="true"]',
	},
	profile: {
		name: "#ember638 > h1",
		headline:
			"#profile-content > div > div.scaffold-layout.scaffold-layout--breakpoint-md.scaffold-layout--main-aside.scaffold-layout--reflow.pv-profile.pvs-loader-wrapper__shimmer--animate > div > div > main > section.artdeco-card.cXqORMzKnsrNEyADqQTscypcvrVkkgMuFQvjkA > div.ph5 > div.mt2.relative > div:nth-child(1) > div.text-body-medium.break-words",
		location:
			"#profile-content > div > div.scaffold-layout.scaffold-layout--breakpoint-md.scaffold-layout--main-aside.scaffold-layout--reflow.pv-profile.pvs-loader-wrapper__shimmer--animate > div > div > main > section.artdeco-card.cXqORMzKnsrNEyADqQTscypcvrVkkgMuFQvjkA > div.ph5 > div.mt2.relative > div.rtSFPoxubRPmZnuKRCKVkSBPSQnDTqOFqtEqGU.mt2 > span.text-body-small.inline.t-black--light.break-words",
		about:
			"#profile-content > div > div.scaffold-layout.scaffold-layout--breakpoint-lg.scaffold-layout--main-aside.scaffold-layout--reflow.pv-profile.pvs-loader-wrapper__shimmer--animate > div > div > main > section:nth-child(4) > div.display-flex.ph5.pv3 > div > div > div > span:nth-child(1)",
	},
};

export function decodeHtmlEntities(text: string | undefined | null): string {
	if (!text) return "";
	return text
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'") // Fixed: Added proper handling for &#039;
		.replace(/&#39;/g, "'")
		.replace(/&apos;/g, "'")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&"); // Moved to end to prevent double unescaping
}

export function processSkills(
	skills: string[] | string | undefined | null,
): string[] {
	if (!skills) return [];

	// Se for uma string única, converte para array
	const skillsArray = Array.isArray(skills) ? skills : [skills];

	const processedSkills: string[] = [];

	for (const skill of skillsArray) {
		if (!skill) continue;

		// Remove "Competências:" prefix if present
		const cleanedSkill = skill.replace(/Competências:\s*/i, "");

		// Split by the middle dot (·) and process each part
		const parts = cleanedSkill.split(/\s*·\s*/);

		for (const part of parts) {
			const trimmedPart = part.trim();
			if (trimmedPart) {
				processedSkills.push(trimmedPart);
			}
		}
	}

	return processedSkills;
}

export function cleanDate(date: string | null | undefined): string {
	if (!date) return "";
	const trimmedDate = date.trim();
	const parts = trimmedDate.split("·");
	return parts[0].trim();
}

export function isValidLinkedInUrl(url: string): boolean {
	return linkedinUrlPattern.test(url);
}
