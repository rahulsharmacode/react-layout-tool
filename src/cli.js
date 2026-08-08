import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { generateStructure } from './generator.js';

// ANSI colors for logs
const green = (str) => `\x1b[32m${str}\x1b[39m`;

function detectFramework() {
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps['next']) return 'next';
      if (deps['react']) return 'react';
    } catch (e) {
      // ignore
    }
  }
  return null;
}

export function runCLI() {
  const detected = detectFramework();
  const questions = [];

  if (detected === 'next') {
    console.log(`\n${green('✨ Next.js project detected!')} Configuring structure for Next.js (App Router).\n`);
  } else if (detected === 'react') {
    console.log(`\n${green('✨ React project detected!')} Configuring structure for React (SPA).\n`);
  } else {
    questions.push({
      type: 'list',
      name: 'framework',
      message: 'No React or Next.js project detected. Which layout template would you like to use?',
      choices: [
        { name: 'React (Standard SPA Setup)', value: 'react' },
        { name: 'Next.js (App Router Setup)', value: 'next' },
      ],
    });
  }

  questions.push(
    {
      type: 'list',
      name: 'layout',
      message: 'Select a folder structure layout:',
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
      when: (answers) => {
        const framework = detected || answers.framework;
        return framework !== 'next'; // Skip for Next.js
      },
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
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Would you like to automatically install the required npm packages?',
      default: true,
    }
  );

  inquirer
    .prompt(questions)
    .then((answers) => {
      const config = {
        framework: detected || answers.framework,
        routing: detected === 'next' ? false : answers.routing,
        ...answers,
      };
      generateStructure(config);
    })
    .catch((error) => {
      console.error('\n❌ An error occurred during scaffolding:', error);
    });
}
