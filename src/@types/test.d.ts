declare global {
	interface MockElement extends Node {
		textContent: string | null;
		querySelector: (selector: string) => MockElement | null;
		querySelectorAll: (selector: string) => MockElement[];
		baseURI: string;
		childNodes: NodeListOf<ChildNode>;
		firstChild: Node | null;
		isConnected: boolean;
		lastChild: Node | null;
		nextSibling: Node | null;
		nodeName: string;
		nodeType: number;
		nodeValue: string | null;
		ownerDocument: Document | null;
		parentElement: Element | null;
		parentNode: Node | null;
		previousSibling: Node | null;
		appendChild: <T extends Node>(node: T) => T;
		cloneNode: (deep?: boolean) => Node;
		compareDocumentPosition: (other: Node) => number;
		contains: (other: Node | null) => boolean;
	}

	interface MockBrowserTarget {
		type: () => string;
		url: () => string;
		browser: () => MockBrowser;
		page: () => Promise<MockPage>;
		worker: () => MockWorker | null;
	}

	interface MockBrowser {
		close: () => Promise<void>;
		pages: () => Promise<MockPage[]>;
		newPage: () => Promise<MockPage>;
		target: () => MockBrowserTarget;
	}

	interface MockWorker {
		url: () => string;
		browser: () => MockBrowser;
	}

	interface MockPage {
		goto: (url: string) => Promise<void>;
		evaluate: <T>(fn: () => T) => Promise<T>;
		isClosed: () => boolean;
		close: () => Promise<void>;
		browser: () => MockBrowser;
		target: () => MockBrowserTarget;
		frames: () => MockPage[];
		workers: () => MockWorker[];
		url: () => string;
		content: () => Promise<string>;
	}

	interface MockBrowserService {
		getPage: () => Promise<MockPage>;
		close: () => Promise<void>;
		initialize: () => Promise<void>;
	}

	interface ProfileResult {
		success: boolean;
		error?: string;
		data?: ProfileData;
	}

	interface ProfileData {
		name: string;
		headline: string;
		location: string;
		about?: string;
		experience?: Array<Experience>;
		education?: Array<Education>;
		certifications?: Array<Certification>;
	}

	interface Experience {
		title: string;
		company: string;
		duration: string;
		description?: string;
		skills?: string[];
	}

	interface Education {
		institution: string;
		degree: string;
		fieldOfStudy?: string;
		startDate: string;
		endDate: string;
		skills?: string[];
	}

	interface Certification {
		name: string;
		organization: string;
		issueDate: string;
		expirationDate?: string;
		skills?: string[];
	}
}

export {};
