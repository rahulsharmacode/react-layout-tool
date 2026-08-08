import inquirer from 'inquirer';
import { generateStructure } from './generator.js';

export function runCLI() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'layout',
        message: 'Select a React folder structure layout:',
        choices: [
          { name: 'Feature-based / Domain-driven (Highly Recommended for scale)', value: 'feature' },
          { name: 'Standard Layered (Components, pages, hooks, services, utils)', value: 'layered' },
          { name: 'Atomic Design (Atoms, molecules, organisms, templates, pages)', value: 'atomic' },
          { name: 'Minimalist (Simple files & folder setup for small projects)', value: 'minimal' },
        ],
      },
      {
        type: 'list',
        name: 'language',
        message: 'Choose language preference:',
        choices: [
          { name: 'TypeScript (ts, tsx)', value: 'ts' },
          { name: 'JavaScript (js, jsx)', value: 'js' },
        ],
      },
      {
        type: 'list',
        name: 'styling',
        message: 'Choose styling methodology:',
        choices: [
          { name: 'Tailwind CSS (utility classes + configurations)', value: 'tailwind' },
          { name: 'Raw CSS (.css)', value: 'css' },
          { name: 'SCSS / Sass (.scss)', value: 'scss' },
        ],
      },
      {
        type: 'confirm',
        name: 'routing',
        message: 'Would you like to include React Router boilerplate?',
        default: true,
      },
      {
        type: 'list',
        name: 'stateManagement',
        message: 'Choose a state management integration:',
        choices: [
          { name: 'None (Default state)', value: null },
          { name: 'Zustand (Lightweight store)', value: 'zustand' },
          { name: 'Redux Toolkit (Enterprise store)', value: 'redux' },
          { name: 'Context API (React built-in global context)', value: 'context' },
        ],
      },
      {
        type: 'confirm',
        name: 'pathAliases',
        message: 'Configure absolute imports/path aliases (@/* -> src/*)?',
        default: true,
      },
    ])
    .then((answers) => {
      generateStructure(answers);
    })
    .catch((error) => {
      console.error('\n❌ An error occurred during scaffolding:', error);
    });
}
