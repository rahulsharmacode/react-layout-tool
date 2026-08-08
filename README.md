# React Layout Tool

`react-layout-tool` is an interactive CLI scaffolding tool that sets up a standardized, optimized React folder structure according to modern industry best practices. It supports multiple design architectures, language choices, styling methodologies, routing, and state management setups.

---

## Features

- 🏗️ **Multiple Layout Architectures**:
  - **Feature-based / Domain-driven** (Highly Recommended for scale)
  - **Standard Layered** (Classic components, pages, hooks, services, utils)
  - **Atomic Design** (Atoms, molecules, organisms, templates)
  - **Minimalist** (Clean and lightweight setup for small projects)
- 🚀 **TypeScript or JavaScript**: Scaffolds `.tsx/.ts` or `.jsx/.js` with correct imports and structure.
- 🎨 **Styling Frameworks**: Supports **Tailwind CSS** (auto-configures `tailwind.config.js` and PostCSS), **SCSS/Sass**, or **Raw CSS**.
- 📍 **Absolute Import / Path Aliasing**: Generates `tsconfig.json` or `jsconfig.json` configured with `@/*` aliases for clean imports.
- ⚙️ **State Management Boilerplate**: Choose between **Zustand**, **Redux Toolkit**, **React Context API**, or standard state.
- 🧭 **Routing Ready**: Generates a standard React Router config with pre-wired routes.

---

## Install and Execute

You can run the tool directly without installation:

```bash
npx react-layout-tool
```

Or install it globally:

```bash
npm install -g react-layout-tool
react-layout-tool
```

---

## Interactive Prompts

When you run the tool, it will guide you through the following setup:

```text
? Select a React folder structure layout:
  ▸ Feature-based / Domain-driven (Highly Recommended for scale)
    Standard Layered (Components, pages, hooks, services, utils)
    Atomic Design (Atoms, molecules, organisms, templates, pages)
    Minimalist (Simple files & folder setup for small projects)

? Choose language preference:
  ▸ TypeScript (ts, tsx)
    JavaScript (js, jsx)

? Choose styling methodology:
  ▸ Tailwind CSS (utility classes + configurations)
    Raw CSS (.css)
    SCSS / Sass (.scss)

? Would you like to include React Router boilerplate? (Y/n)

? Choose a state management integration:
    None (Default state)
  ▸ Zustand (Lightweight store)
    Redux Toolkit (Enterprise store)
    Context API (React built-in global context)

? Configure absolute imports/path aliases (@/* -> src/*)? (Y/n)
```

---

## Generated Folder Structures

### 1. Feature-based (Recommended)
Highly modular design that groups files by feature domain (e.g. Auth, Dashboard) rather than technical type.
```text
├── tailwind.config.js       # (If Tailwind is selected)
├── tsconfig.json            # (If TypeScript + Path Aliases selected)
└── src
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── components/
    │   ├── ui/
    │   │   └── Button.tsx
    │   └── common/
    │       ├── Header.tsx
    │       └── Footer.tsx
    ├── features/
    │   ├── auth/
    │   │   ├── components/
    │   │   │   └── LoginForm.tsx
    │   │   ├── hooks/
    │   │   │   └── useAuth.ts
    │   │   └── services/
    │   │       └── authApi.ts
    │   └── dashboard/
    │       └── components/
    │           ├── StatsGrid.tsx
    │           └── RecentActivity.tsx
    ├── pages/
    │   ├── Home.tsx
    │   └── Dashboard.tsx
    ├── routes/
    │   └── index.tsx        # (If Router selected)
    ├── store/               # (If Zustand/Redux selected)
    │   └── useAppStore.ts
    └── utils/
        └── formatters.ts
```

### 2. Standard Layered
Organizes modules strictly by technical layers (components, hooks, pages, services).
```text
└── src
    ├── components/
    │   ├── common/
    │   │   ├── Header.tsx
    │   │   └── Footer.tsx
    │   └── ui/
    │       └── Button.tsx
    ├── pages/
    │   ├── Home.tsx
    │   └── Dashboard.tsx
    ├── hooks/
    │   └── useAuth.ts
    ├── services/
    │   └── api.ts
    └── utils/
        └── helpers.ts
```

---

## License

ISC License.
