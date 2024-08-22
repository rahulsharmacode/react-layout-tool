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
│   │   ├── css
│   │   │   └── main.css
│   │   ├── icon
│   │   │   └── index.icon.jsx
│   │   ├── constant
│   │   │   └── index.constant.jsx
│   │   ├── images
├── src
│   ├── pages
│   │   ├── dashboard
│   │   │   ├── index.css
│   │   │   └── index.jsx
│   │   ├── home
│   │       ├── index.css
│   │       └── index.jsx
│   ├── services
│   │   ├── api.services.js
│   │   └── index.services.js
│   ├── ui
│   │   ├── external
│   │   │   ├── components
│   │   │   │   └── button
│   │   │   │       ├── Button.css
│   │   │   │       └── Button.jsx
│   │   ├── internal
│   │   │   ├── components
│   │   │   │   ├── footer
│   │   │   │   │   ├── index.css
│   │   │   │   │   └── index.jsx
│   │   │   │   ├── header
│   │   │   │   │   ├── index.css
│   │   │   │   │   └── index.jsx
│   │   │   │   ├── sidebar
│   │   │   │       ├── index.css
│   │   │   │       └── index.jsx
│   ├── utils
│   │   ├── helper
│   │   │   └── index.helper.js
│   │   ├── hook
│   │   │   └── index.hook.jsx
│   │   ├── interface
│   │   │   ├── form.interface.js
│   │   │   ├── index.enum.js
│   │   │   └── index.interface.js
│   │   ├── layout
│   │   │   └── index.layout.jsx
│   │   ├── states
│   │       ├── atom.js
│   │       └── selector.js



## Installation Steps

To install the React Layout Tool package, use the following command:

step 1 :
npm install react-layout-tool

step 2 :
npx react-layout-tool

