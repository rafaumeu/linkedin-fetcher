import { linkedinSelectors } from "@/utils/domUtils";
import { cleanDate, decodeHtmlEntities } from "@/utils/domUtils";

// Função genérica para extrair elementos
function extractElements<T>(
	document: Document,
	containerSelector: string,
	extractorFn: (element: Element) => T,
): T[] {
	return Array.from(document.querySelectorAll(containerSelector)).map(
		extractorFn,
	);
}

// Uso na função extractExperiences
export function extractExperiences(document: Document) {
	return extractElements(
		document,
		linkedinSelectors.experience.container,
		(exp) => {
			const titleElement = exp.querySelector(
				linkedinSelectors.experience.title,
			);
			const companyElement = exp.querySelector(
				linkedinSelectors.experience.company,
			);
			const infoElements = exp.querySelectorAll(
				linkedinSelectors.experience.info,
			);
			const descriptionElement = exp.querySelector(
				linkedinSelectors.experience.description,
			);
			const skills = extractSkills(exp, linkedinSelectors.experience.skills);

			const rawTitle = titleElement?.textContent?.trim() || "";
			const rawCompany =
				companyElement?.textContent?.split("·")[0]?.trim() || "";
			const rawDescription = descriptionElement?.textContent?.trim() || "";

			return {
				title: decodeHtmlEntities(rawTitle),
				company: decodeHtmlEntities(rawCompany),
				duration: decodeHtmlEntities(
					infoElements[0]?.textContent?.trim() || "",
				),
				location: decodeHtmlEntities(
					infoElements[1]?.textContent?.trim() || "",
				),
				description: decodeHtmlEntities(rawDescription),
				skills,
			};
		},
	);
}

export function extractEducation(document: Document) {
	return Array.from(
		document.querySelectorAll(linkedinSelectors.education.container),
	).map((edu) => {
		const institutionElement = edu.querySelector(
			linkedinSelectors.education.institution,
		);
		const degreeElement = edu.querySelector(linkedinSelectors.education.degree);
		const dateElement = edu.querySelector(linkedinSelectors.education.date);
		const { startDate, endDate } = extractDates(dateElement);
		const { degree, fieldOfStudy } = extractDegreeInfo(degreeElement);
		const skills = extractSkills(edu, linkedinSelectors.education.skills);

		return {
			institution: decodeHtmlEntities(
				institutionElement?.textContent?.trim() || "",
			),
			degree: decodeHtmlEntities(degree),
			fieldOfStudy: decodeHtmlEntities(fieldOfStudy),
			startDate: cleanDate(startDate),
			endDate: cleanDate(endDate),
			skills,
		};
	});
}

export function extractCertifications(document: Document) {
	return Array.from(
		document.querySelectorAll(linkedinSelectors.certifications.container),
	).map((cert) => {
		const institutionElement = cert.querySelector(
			linkedinSelectors.certifications.organization,
		);
		const titleElement = cert.querySelector(
			linkedinSelectors.certifications.title,
		);
		const dateElement = cert.querySelector(
			linkedinSelectors.certifications.date,
		);
		const skills = extractSkills(cert, linkedinSelectors.certifications.skills);

		return {
			name: decodeHtmlEntities(titleElement?.textContent?.trim() || ""),
			organization: decodeHtmlEntities(
				institutionElement?.textContent?.trim() || "",
			),
			issueDate: decodeHtmlEntities(dateElement?.textContent?.trim() || ""),
			skills,
		};
	});
}

export function extractBasicInfo(document: Document) {
	const nameElement = document.querySelector(linkedinSelectors.profile.name);
	const headlineElement = document.querySelector(
		linkedinSelectors.profile.headline,
	);
	const locationElement = document.querySelector(
		linkedinSelectors.profile.location,
	);
	const aboutElement = document.querySelector(linkedinSelectors.profile.about);

	return {
		name: decodeHtmlEntities(nameElement?.textContent?.trim() || ""),
		headline: decodeHtmlEntities(headlineElement?.textContent?.trim() || ""),
		location: decodeHtmlEntities(locationElement?.textContent?.trim() || ""),
		about: decodeHtmlEntities(aboutElement?.textContent?.trim() || ""),
	};
}
export function extractSkills(element: Element, selector: string): string[] {
	// Verificar se element ou querySelectorAll é undefined/null
	if (!element || !element.querySelectorAll) {
		return [];
	}

	try {
		const skillsElements = Array.from(
			element.querySelectorAll(selector) || [],
		).filter((span) => span.textContent?.includes("Competências:"));

		const skills: string[] = [];
		for (const element of skillsElements) {
			const skillsText = element.textContent
				?.trim()
				.replace("Competências:", "")
				.trim();

			if (skillsText) {
				const newSkills = skillsText
					.split("·")
					.map((skill) => skill.trim().replace(/\s+/g, ""))
					.filter(Boolean);
				skills.push(...newSkills);
			}
		}
		return skills;
	} catch (error) {
		// Em caso de erro, retornar array vazio
		return [];
	}
}

export function extractDates(dateElement: Element | null) {
	let startDate = "";
	let endDate = "";

	if (dateElement) {
		const dateText = dateElement.textContent?.trim() || "";
		// Check if the date contains a hyphen for date range
		if (dateText.includes(" - ")) {
			const dateParts = dateText.split(" - ");
			/* v8 ignore next */
			startDate = cleanDate(dateParts[0]?.trim() || "");
			// Verificar se existe uma segunda parte e se não está vazia
			/* v8 ignore next */
			const secondPart = dateParts[1]?.trim() || "";
			/* v8 ignore next */
			if (secondPart) {
				/* v8 ignore next */
				endDate = cleanDate(secondPart.split("·")[0]?.trim() || "");
			}
		} else {
			// If there's no hyphen, it's just a start date
			startDate = cleanDate(dateText.replace("-", "").trim());
		}
	}

	return { startDate, endDate };
}

export function extractDegreeInfo(degreeElement: Element | null) {
	let degree = "";
	let fieldOfStudy = "";

	if (degreeElement) {
		const degreeText = degreeElement.textContent?.trim() || "";
		const parts = degreeText.split(", ");
		degree = parts[0] || "";
		fieldOfStudy = parts[1] || "";
	}

	return { degree, fieldOfStudy };
}
