# 📦 @pilag6/pretty-json

> Open any JSON object in your browser with pretty formatting, collapsible objects, dark/light theme, and line-by-line indentation. Ideal for debugging and quick inspection of JSON data.

---

## 🎯 Features

- 🖥️ **Web-based viewer** – Instantly view JSON in a browser.
- 🌙 **Dark/Light theme toggle** – Eye-friendly modes.
- ➕ **Collapsible objects and arrays** – Navigate large structures easily.
- 🎯 **Syntax highlighting** – Keys and values color-coded by type.
- 🧠 **Minimal setup** – Just one function to serve and open.
- 🚀 **Fast and lightweight** – No dependencies, zero config.

---

## 📦 Installation

```bash
npm install @pilag6/pretty-json
```

## 🚀 Usage

You can use it in any TypeScript or Node.js project to visualize JSON data:

```typescript
import { serveJsonPretty } from '@pilag6/pretty-json';

const data = {
  name: 'Maia',
  age: 1,
  interests: ['music', 'books'],
  active: true,
};

serveJsonPretty(data); // Opens in browser at http://localhost:1984
```

> Optional: You can pass a custom port:

```typescript
serveJsonPretty(data, 3000); // Opens in browser at http://localhost:3000
```

## 🛠️ API
### `serveJsonPretty(data: object, port?: number): void`

| Param | Type    | Description                                         |
|-------|---------|-----------------------------------------------------|
| data  | object  | The JSON data you want to inspect                   |
| port  | number  | (Optional) Port to serve on (default: `1984`)       |

**Permissions & Security**

- Opens your default browser using `child_process.exec`.
- Runs a local-only HTTP server (no external connections allowed).

---

## 💡 Inspiration

Born from the need to debug large JSON responses quickly and securely, without relying on online tools. This project keeps your data offline and accessible in seconds.

---

## 📄 License

MIT © Pila Gonzalez
