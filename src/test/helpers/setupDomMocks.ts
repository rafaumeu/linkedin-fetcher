import { JSDOM } from "jsdom";

/**
 * Configura o ambiente DOM global para testes
 */
export function setupDomMocks(): void {
	const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
	global.document = dom.window.document;
	global.window = dom.window as any;
}

/**
 * Cria um elemento DOM com atributos e conteúdo
 * @param tag Tag HTML do elemento
 * @param attributes Atributos do elemento
 * @param textContent Conteúdo de texto do elemento
 * @returns Elemento DOM criado
 */
export function createElement(
	tag: string,
	attributes: Record<string, string> = {},
	textContent?: string,
): HTMLElement {
	const element = document.createElement(tag);

	for (const [key, value] of Object.entries(attributes)) {
		element.setAttribute(key, value);
	}

	if (textContent !== undefined) {
		element.textContent = textContent;
	}

	return element;
}
