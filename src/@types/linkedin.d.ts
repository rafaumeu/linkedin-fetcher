export interface BrowserService {
    getPage: () => Promise<{
        goto: (url: string) => Promise<void>;
        evaluate: <T>(fn: () => T) => Promise<T>;
    }>;
    close: () => Promise<void>;
}

export interface Experience {
    title: string;
    company: string;
    duration: string;
    location?: string;
    description: string;
    skills?: string[];
}

export interface Education {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    skills?: string[];
}

export interface Certification {
    name: string;
    organization: string;
    issueDate: string;
    skills?: string[];
}

export interface ProfileData {
    name: string;
    headline: string;
    location: string;
    about?: string;
    experience: Experience[];  // Using the Experience interface
    education: Education[];    // Using the Education interface
    certifications: Certification[];  // Using the Certification interface
}

export interface ScrapingResult<T> {
    success: boolean;
    data?: ProfileData;
    error?: string;
}
