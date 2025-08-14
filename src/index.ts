import { exec } from 'child_process';
import http from 'http';

/**
 * Starts a local HTTP server on the given port to serve the JSON in a pretty format
 */
export function serveJsonPretty(data: object, port: number = 1984) {
	const jsonStr = JSON.stringify(data, null, 2);
	const html = generateHtml(jsonStr);

	const server = http.createServer((_req, res) => {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(html);
	});

	server.listen(port, () => {
		const url = `http://localhost:${port}`;
		console.log(`🟢 JSON Viewer running at: ${url}`);

		const command = getOpenCommand(url);
		exec(command, (err) => {
			if (err) {
				console.warn(`⚠️ Could not open browser. Open manually: ${url}`);
			} else {
				console.log('✅ Browser opened successfully.');
			}
		});
	});
}

/**
 * Generates the HTML string with embedded JSON
 */
function generateHtml(jsonStr: string): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Pretty JSON Viewer</title>
  <style>
    :root {
      --bg-dark: #1e1e1e;
      --bg-light: #f8f9fa;
      --text-dark: #f1f1f1;
      --text-light: #2d3748;
      --key-color-dark: #9cdcfe;
      --key-color-light: #2563eb;
      --string-color-dark: #ce9178;
      --string-color-light: #059669;
      --number-color-dark: #b5cea8;
      --number-color-light: #dc2626;
      --boolean-color-dark: #569cd6;
      --boolean-color-light: #7c3aed;
      --null-color-dark: #dcdcaa;
      --null-color-light: #6b7280;
      --border-color-dark: #333;
      --border-color-light: #e5e7eb;
      --gutter-bg-dark: #252525;
      --gutter-bg-light: #f8f9fa;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-dark);
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      padding: 0;
      margin: 0;
      line-height: 1.5;
    }

    body.light {
      background-color: var(--bg-light);
      color: var(--text-light);
    }

    .toolbar {
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.1);
      padding: 8px 12px;
      border-radius: 6px;
      z-index: 1000;
    }

    body.light .toolbar {
      background: rgba(0, 0, 0, 0.05);
      border: 1px solid var(--border-color-light);
    }

    button {
      cursor: pointer;
      font-size: 14px;
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.2);
      color: inherit;
      transition: background 0.2s;
    }

    button:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    body.light button {
      background: rgba(0, 0, 0, 0.1);
    }

    body.light button:hover {
      background: rgba(0, 0, 0, 0.15);
    }

    .json-editor {
      display: flex;
      min-height: calc(100vh - 40px);
    }

    .gutter {
      width: 50px;
      background-color: var(--gutter-bg-dark);
      border-right: 1px solid var(--border-color-dark);
      padding: 0;
      position: relative;
    }

    body.light .gutter {
      background-color: var(--gutter-bg-light);
      border-right-color: var(--border-color-light);
    }

    .gutter-line {
      height: 1.5em;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0 5px;
    }

    .toggle-button {
      color: #888;
      cursor: pointer;
      font-weight: bold;
      user-select: none;
      font-size: 12px;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      transition: all 0.2s;
    }

    .toggle-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    body.light .toggle-button {
      color: #666;
    }

    body.light .toggle-button:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: #000;
    }

    .content {
      flex: 1;
      padding: 0 20px;
      background-color: var(--bg-dark);
      overflow-x: auto;
    }

    body.light .content {
      background-color: var(--bg-light);
    }

    .json-line {
      height: 1.5em;
      display: flex;
      align-items: center;
      position: relative;
    }

    .json-line span {
      display: inline-block;
    }

    .key {
      color: var(--key-color-dark);
      font-weight: 500;
    }

    body.light .key {
      color: var(--key-color-light);
    }

    .string {
      color: var(--string-color-dark);
    }

    body.light .string {
      color: var(--string-color-light);
    }

    .number {
      color: var(--number-color-dark);
      font-weight: 500;
    }

    body.light .number {
      color: var(--number-color-light);
    }

    .boolean {
      color: var(--boolean-color-dark);
      font-weight: 500;
    }

    body.light .boolean {
      color: var(--boolean-color-light);
    }

    .null {
      color: var(--null-color-dark);
      font-style: italic;
    }

    body.light .null {
      color: var(--null-color-light);
    }

    .bracket, .comma {
      color: #888;
    }

    .collapsed-indicator {
      color: #888;
      opacity: 0.7;
    }

    .line-hidden {
      display: none;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button onclick="toggleTheme()">🌓</button>
  </div>
  
  <div class="json-editor">
    <div class="gutter" id="gutter"></div>
    <div class="content" id="content"></div>
  </div>

  <script>
    const data = ${jsonStr};
    const gutterContainer = document.getElementById('gutter');
    const contentContainer = document.getElementById('content');
    
    let lineNumber = 0;
    let allLines = [];

    function toggleTheme() {
      document.body.classList.toggle('light');
    }

    function createLine(content, depth = 0, hasToggle = false, lineId = null) {
      const currentLineNumber = lineNumber++;
      
      // Create gutter line
      const gutterLine = document.createElement('div');
      gutterLine.className = 'gutter-line';
      
      if (hasToggle) {
        const toggle = document.createElement('div');
        toggle.className = 'toggle-button';
        toggle.textContent = '[-]';
        toggle.dataset.lineId = lineId || currentLineNumber;
        gutterLine.appendChild(toggle);
      }
      
      // Create content line
      const contentLine = document.createElement('div');
      contentLine.className = 'json-line';
      contentLine.dataset.lineId = currentLineNumber;
      contentLine.dataset.depth = depth;
      
      // Create proper indentation with spans for better control
      const indentSpan = document.createElement('span');
      indentSpan.style.paddingLeft = (depth * 20) + 'px';
      indentSpan.innerHTML = content;
      contentLine.appendChild(indentSpan);
      
      const lineInfo = {
        gutterLine,
        contentLine,
        lineNumber: currentLineNumber,
        depth,
        hasToggle,
        toggleId: lineId || currentLineNumber
      };
      
      allLines.push(lineInfo);
      
      gutterContainer.appendChild(gutterLine);
      contentContainer.appendChild(contentLine);
      
      return lineInfo;
    }

    function render(value, key = null, depth = 0) {
      const isArray = Array.isArray(value);
      const isObject = typeof value === 'object' && value !== null;
      
      if (isObject) {
        const keys = Object.keys(value);
        const startLineId = lineNumber;
        
        // Opening line
        const keyStr = key !== null ? '<span class="key">' + escapeHtml(key) + '</span>: ' : '';
        const bracket = '<span class="bracket">' + (isArray ? '[' : '{') + '</span>';
        const collapsedIndicator = '<span class="collapsed-indicator" style="display:none;">' + (isArray ? '[...]' : '{...}') + '</span>';
        
        createLine(keyStr + bracket + collapsedIndicator, depth, true, startLineId);
        
        // Children
        const childLines = [];
        keys.forEach((k, index) => {
          const childLinesBefore = allLines.length;
          render(value[k], k, depth + 1);
          const childLinesAfter = allLines.length;
          
          // Add comma to last line if not the last item
          if (index < keys.length - 1) {
            const lastChildLine = allLines[allLines.length - 1];
            lastChildLine.contentLine.innerHTML += '<span class="comma">,</span>';
          }
          
          // Track child lines
          for (let i = childLinesBefore; i < childLinesAfter; i++) {
            childLines.push(i);
          }
        });
        
        // Closing line
        const closingBracket = '<span class="bracket">' + (isArray ? ']' : '}') + '</span>';
        const closingLine = createLine(closingBracket, depth);
        childLines.push(allLines.length - 1);
        
        // Add toggle functionality
        const toggleButton = gutterContainer.querySelector('[data-line-id="' + startLineId + '"]');
        if (toggleButton) {
          toggleButton.addEventListener('click', () => {
            const isCollapsed = toggleButton.textContent === '[+]';
            const startLine = allLines[startLineId];
            const collapsedSpan = startLine.contentLine.querySelector('.collapsed-indicator');
            
            childLines.forEach(childLineIndex => {
              const childLine = allLines[childLineIndex];
              if (childLine) {
                childLine.contentLine.style.display = isCollapsed ? 'flex' : 'none';
                childLine.gutterLine.style.display = isCollapsed ? 'flex' : 'none';
              }
            });
            
            collapsedSpan.style.display = isCollapsed ? 'none' : 'inline';
            toggleButton.textContent = isCollapsed ? '[-]' : '[+]';
          });
        }
        
      } else {
        // Primitive value
        let type = typeof value;
        let valText = '';

        if (value === null) {
          type = 'null';
          valText = 'null';
        } else if (type === 'string') {
          valText = '"' + escapeHtml(value) + '"';
        } else {
          valText = escapeHtml(value.toString());
        }

        const keyStr = key !== null ? '<span class="key">' + escapeHtml(key) + '</span>: ' : '';
        const valueStr = '<span class="' + type + '">' + valText + '</span>';
        
        createLine(keyStr + valueStr, depth);
      }
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Render the JSON
    render(data);
  </script>
</body>
</html>
`;
}

/**
 * Returns the command to open a file or URL depending on OS
 */
function getOpenCommand(target: string): string {
	return process.platform === 'win32'
		? `start "" "${target}"`
		: process.platform === 'darwin'
		? `open "${target}"`
		: `xdg-open "${target}"`;
}