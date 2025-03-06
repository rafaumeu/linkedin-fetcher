interface Experience {
	title: string;
	company: string;
	duration: string;
	description?: string;
}

interface Skill {
	name: string;
	endorsements?: number;
}

interface Education {
	school: string;
	degree?: string;
	field?: string;
	duration?: string;
}

interface Certification {
	name: string;
	organization: string;
	issueDate?: string;
	expirationDate?: string;
}

interface LinkedInProfile {
	experience: Experience[];
	skills: Skill[];
	education: Education[];
	certifications: Certification[];
}

export type { LinkedInProfile, Experience, Skill, Education, Certification };
