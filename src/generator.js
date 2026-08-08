import fs from 'fs';
import path from 'path';
import { getStructure } from './templates/structures.js';
import * as contents from './templates/contents.js';

// ANSI coloring utilities for beautiful terminal output
const bold = (str) => `\x1b[1m${str}\x1b[22m`;
const green = (str) => `\x1b[32m${str}\x1b[39m`;
const cyan = (str) => `\x1b[36m${str}\x1b[39m`;
const yellow = (str) => `\x1b[33m${str}\x1b[39m`;
const gray = (str) => `\x1b[90m${str}\x1b[39m`;
const red = (str) => `\x1b[31m${str}\x1b[39m`;

export function generateStructure(config) {
  const { layout, language, styling, routing, stateManagement, pathAliases } = config;
  const isTS = language === 'ts';

  console.log('\n' + bold(cyan('🚀 React Layout Tool - Scaffold Starting...')));
  console.log(gray('--------------------------------------------------'));

  const filesMap = getStructure(config);
  let createdDirs = new Set();
  let createdFilesCount = 0;

  Object.entries(filesMap).forEach(([filePath, metadata]) => {
    const fullPath = path.join(process.cwd(), filePath);
    const dirPath = path.dirname(fullPath);

    // Create directories if they don't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      createdDirs.add(path.relative(process.cwd(), dirPath));
    }

    // Determine contents based on metadata
    let fileContent = '';
    const name = metadata.name;

    switch (metadata.type) {
      case 'app':
        fileContent = contents.getAppContent(config);
        break;
      case 'main':
        fileContent = contents.getMainContent(config);
        break;
      case 'style':
        fileContent = name === 'index' 
          ? contents.getIndexCss(styling) 
          : contents.getComponentStyle(name);
        break;
      case 'component':
        fileContent = contents.getComponentContent(name, config);
        break;
      case 'page':
        fileContent = contents.getPageContent(name, config);
        break;
      case 'hook':
        fileContent = contents.getHookContent(name, config);
        break;
      case 'service':
        fileContent = contents.getServiceContent({ ...config, name });
        break;
      case 'util':
        fileContent = contents.getUtilContent({ ...config, name });
        break;
      case 'store':
        fileContent = name === 'zustand' 
          ? contents.getZustandContent(config) 
          : contents.getReduxContent(config);
        break;
      case 'slice':
        fileContent = contents.getReduxSliceContent(config);
        break;
      case 'context':
        fileContent = contents.getContextContent(config);
        break;
      case 'router':
        fileContent = contents.getRouterContent(config);
        break;
      case 'config':
        if (name === 'tailwind') fileContent = contents.getTailwindConfig(isTS);
        if (name === 'postcss') fileContent = contents.getPostcssConfig();
        if (name === 'tsconfig') fileContent = contents.getTsConfig();
        if (name === 'tsconfig.node') fileContent = contents.getTsconfigNodeConfig();
        if (name === 'jsconfig') fileContent = contents.getJsConfig();
        if (name === 'constants') fileContent = contents.getConstantsContent(config);
        if (name === 'types') fileContent = contents.getTypesDeclaration();
        break;
      default:
        fileContent = '';
    }

    // Only write if file doesn't already exist to prevent overwrites
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, fileContent, 'utf8');
      console.log(`  ${green('✔')} Created: ${filePath}`);
      createdFilesCount++;
    } else {
      console.log(`  ${yellow('⚠')} Skipped (exists): ${filePath}`);
    }
  });

  console.log(gray('--------------------------------------------------'));
  console.log(`${green('✨ Success!')} Generated ${bold(createdFilesCount)} files across ${bold(createdDirs.size)} directories.\n`);

  // Print helpful post-generation hints
  console.log(bold('👉 Next Steps / Recommendations:'));
  
  if (styling === 'tailwind') {
    console.log(`  1. Install Tailwind dependencies if you haven't:`);
    console.log(cyan('     npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p'));
  }
  
  if (routing) {
    console.log(`  2. Install React Router DOM if you haven't:`);
    console.log(cyan('     npm install react-router-dom'));
  }

  if (stateManagement === 'zustand') {
    console.log(`  3. Install Zustand:`);
    console.log(cyan('     npm install zustand'));
  } else if (stateManagement === 'redux') {
    console.log(`  3. Install Redux Toolkit:`);
    console.log(cyan('     npm install @reduxjs/toolkit react-redux'));
  }

  if (pathAliases) {
    console.log(`  4. If using Vite, configure your ${bold('vite.config.' + (isTS ? 'ts' : 'js'))} to support path aliases:`);
    console.log(gray(`     import path from 'path';`));
    console.log(gray(`     // Inside defineConfiguration resolve.alias: { '@': path.resolve(__dirname, './src') }`));
  }
  console.log('');
}
