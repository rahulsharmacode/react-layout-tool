# React Layout Tool
`react-layout-tool`

A CLI tool to generate a standardized folder structure for React applications with pre-defined components, pages, utilities, and styles. This tool allows developers to quickly scaffold a React project with customizable file extensions and styles.

## Features

- Customizable Folder Structure: Automatically creates a well-organized folder structure tailored for React projects.
- File Content Generation: Pre-populates files with boilerplate code, including components, pages, and utility functions.
- Configurable Extensions: Choose between .jsx and .tsx file extensions to match your project's needs.
- Style Options: Select between .css and .scss stylesheets for your project.


## Folder Structure
```bash
├── public
│   ├── assets
│   │   └── logo.png
│   ├── css
│   │   └── main.css
├── src
│   ├── pages
│   │   ├── dashboard
│   │   │   └── index.jsx
│   │   └── home
│   │       └── index.jsx
│   ├── utils
│   │   ├── components
│   │   │   ├── header
│   │   │   │   └── index.jsx
│   │   │   ├── footer
│   │   │   │   ├── index.jsx
│   │   │   │   └── index.function.jsx
│   │   │   ├── sidebar
│   │   │   │   └── index.jsx
│   │   ├── helper
│   │   │   └── index.helper.jsx
│   │   ├── hook
│   │   │   └── index.hook.jsx
│   │   ├── interface
│   │   │   └── index.interface.jsx
│   │   ├── private
│   │   │   └── index.private.jsx
│   │   ├── services
│   │   │   ├── api.private.jsx
│   │   │   └── index.private.jsx
│   │   ├── states
│   │   │   ├── atom.jsx
│   │   │   └── selector.jsx


## Installation Step 1

To install the React Layout Tool package, use the following command:

step 1 :
```bash
npm install react-layout-tool

step 2 :
```bash
npx react-layout-tool

