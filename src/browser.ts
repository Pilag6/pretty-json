import { generateHtmlFromJson } from './htmlTemplate.ts';

/**
 * Opens a new tab with the pretty JSON view
 */
export function renderJsonPretty(data: object) {
	const html = generateHtmlFromJson(data);
	const newWindow = window.open('', '_blank');
	if (newWindow) {
		newWindow.document.write(html);
		newWindow.document.close();
	}
}
