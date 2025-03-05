export class AppError extends Error {
	statusCode: number;
	constructor(message: string, statusCode = 400) {
		super(message);
		this.statusCode = statusCode;
		this.name = "AppError";
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 400);
		this.name = "ValidationError";
	}
}

export class ProfileNotFoundError extends Error {
	profileUrl: string;
	constructor(profileUrl: string) {
		super(`Profile not found: ${profileUrl}`);
		this.name = "ProfileNotFoundError";
		this.profileUrl = profileUrl;
	}
}

export class NotFoundError extends AppError {
	constructor(resource: string) {
		super(`${resource} não encontrado`, 404);
		this.name = "NotFoundError";
	}
}

export class LinkedInRateLimitError extends AppError {
	constructor() {
		super("LinkedIn rate limit exceeded", 429);
		this.name = "LinkedInRateLimitError";
	}
}

export class NavigationError extends AppError {
	constructor(message: string) {
		super(`Navigation error: ${message}`, 500);
		this.name = "NavigationError";
	}
}
