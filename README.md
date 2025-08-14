# 📦 Pretty JSON

[![npm version](https://img.shields.io/npm/v/@pilag6/pretty-json.svg)](https://www.npmjs.com/package/@pilag6/pretty-json)
[![npm downloads](https://img.shields.io/npm/dm/@pilag6/pretty-json.svg)](https://www.npmjs.com/package/@pilag6/pretty-json)
[![GitHub license](https://img.shields.io/github/license/pilag6/pretty-json.svg)](LICENSE)

> Open any JSON object in your browser with pretty formatting, collapsible objects, dark/light theme, and line-by-line indentation. Ideal for debugging and quick inspection of JSON data.

---

## 🎯 Features

- 🖥️ **Backend and frontend support** – Use it in Node.js or in the browser.
- 🌓 **Dark/Light theme toggle** – Built-in accessibility toggle.
- ➕ **Collapsible objects and arrays** – Navigate large structures easily.
- 🎨 **Syntax highlighting** – Keys and values styled by type.
- 🧠 **Zero config** – Just call one function and you're done.
- 🚀 **Fast and dependency-free** – No external libraries required.

---

## 📦 Installation

```bash
npm install @pilag6/pretty-json
```

## 🚀 Backend Usage (Node.js)

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

## 🌐 Frontend Usage (React/Vue/Vanilla)

✅ React Example

```typescript
import { renderJsonPretty } from '@pilag6/pretty-json';

const App = () => {
  const handleClick = () => {
    const json = {
      user: 'John',
      roles: ['admin', 'editor'],
    };
    renderJsonPretty(json); // Opens a new tab with styled JSON
  };

  return <button onClick={handleClick}>View JSON</button>;
};
export default App;
```

✅ Vue Example

```typescript
<template>
  <button @click="showJson">View JSON</button>
</template>

<script setup lang="ts">
import { renderJsonPretty } from '@pilag6/pretty-json';

const showJson = () => {
  const json = {
    name: 'Jane',
    active: true,
    nested: { a: 1, b: [2, 3] },
  };
  renderJsonPretty(json); // Opens JSON in a new tab
};
</script>
```

## 🛠️ API
### `serveJsonPretty(data: object, port?: number): void` — (Backend)

| Param | Type    | Description                                         |
|-------|---------|-----------------------------------------------------|
| data  | object  | JSON to serve in a browser                  |
| port  | number  | (Optional) Port to serve on (default: `1984`)       |

### `renderJsonPretty(data: object): void` — (Frontend)
| Param | Type    | Description                                         |
|-------|---------|-----------------------------------------------------|
| data  | object  | JSON to render in a new browser tab                  |

---

**Permissions & Security**

- Opens your default browser using `child_process.exec`.
- Runs a local-only HTTP server (no external connections allowed).

---

## 💡 Why this exists?

Sometimes you just want to see JSON structured and styled beautifully, either locally or from a browser-based app, without pasting it into third-party tools. This package solves that, both for frontend and backend.

## 🧪 Works great with

- REST API responses
- Local development
- Debugging deep JSON objects 
- Teaching JSON structure

## 💡 Inspiration

Born from the need to debug large JSON responses quickly and securely, without relying on online tools. This project keeps your data offline and accessible in seconds.

---

## 📄 License

MIT © Pila Gonzalez
