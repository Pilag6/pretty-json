import http from 'http';
import { exec } from 'child_process';
import { generateHtmlFromJson } from './htmlTemplate.ts';

export function serveJsonPretty(data: object, port: number = 1984) {
	const html = generateHtmlFromJson(data);
	const server = http.createServer((_req, res) => {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(html);
	});

	server.listen(port, () => {
		const url = `http://localhost:${port}`;
		console.log(`🟢 JSON Viewer running at: ${url}`);
		exec(getOpenCommand(url), (err) => {
			if (err) console.warn(`⚠️ Could not open browser. Open manually: ${url}`);
		});
	});
}

function getOpenCommand(target: string): string {
	return process.platform === 'win32'
		? `start "" "${target}"`
		: process.platform === 'darwin'
		? `open "${target}"`
		: `xdg-open "${target}"`;
}
