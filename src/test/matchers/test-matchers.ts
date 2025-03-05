/**
 * Matchers personalizados para testes de perfil
 */
export const profileMatchers = {
  toBeEmptyExperience(received: any) {
    // Check if all required fields are empty strings except title
    // This allows for cases where title might have a value but everything else is empty
    const pass = 
      received.company === "" && 
      received.duration === "" && 
      received.location === "" && 
      received.description === "" && 
      Array.isArray(received.skills) && 
      received.skills.length === 0;
    
    return {
      pass,
      message: () => 
        pass 
          ? `Expected ${JSON.stringify(received)} not to be an empty experience`
          : `Expected ${JSON.stringify(received)} to be an empty experience`,
    };
  },
};

// Estende o tipo global do Vitest para incluir nossos matchers personalizados
declare global {
	namespace Vi {
		interface Assertion {
			toBeEmptyExperience(): void;
			toBeValidProfile(): void;
			toHaveValidExperience(): void;
			toHaveValidEducation(): void;
		}
		interface AsymmetricMatchersContaining {
			toBeEmptyExperience(): void;
			toBeValidProfile(): void;
			toHaveValidExperience(): void;
			toHaveValidEducation(): void;
		}
	}
}

// Ensure TypeScript recognizes the extended matchers
interface CustomMatchers<R = unknown> {
	toBeEmptyExperience(): R;
	toBeValidProfile(): R;
	toHaveValidExperience(): R;
	toHaveValidEducation(): R;
}

declare module "vitest" {
	interface Assertion extends CustomMatchers {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
