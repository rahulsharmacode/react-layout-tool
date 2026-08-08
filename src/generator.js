import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
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

  const pkgPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.log(`  ${green('✔')} Created package.json with runner scripts.`);
    const defaultPkg = {
      name: config.framework === 'next' ? 'nextjs-project' : 'react-project',
      private: true,
      version: '0.1.0',
      type: config.framework === 'next' ? undefined : 'module',
      scripts: config.framework === 'next' ? {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      } : {
        dev: 'vite',
        build: isTS ? 'tsc && vite build' : 'vite build',
        preview: 'vite preview'
      }
    };
    fs.writeFileSync(pkgPath, JSON.stringify(defaultPkg, null, 2), 'utf8');
  } else {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.scripts = pkg.scripts || {};
      if (config.framework === 'next') {
        pkg.scripts['dev'] = pkg.scripts['dev'] || 'next dev';
        pkg.scripts['build'] = pkg.scripts['build'] || 'next build';
        pkg.scripts['start'] = pkg.scripts['start'] || 'next start';
      } else {
        pkg.scripts['dev'] = pkg.scripts['dev'] || 'vite';
        pkg.scripts['build'] = pkg.scripts['build'] || (isTS ? 'tsc && vite build' : 'vite build');
        pkg.scripts['preview'] = pkg.scripts['preview'] || 'vite preview';
        pkg.type = 'module';
      }
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
      console.log(`  ${green('✔')} Configured runner scripts in package.json.`);
    } catch (e) {
      console.error(red(`❌ Failed to update package.json scripts: ${e.message}`));
    }
  }

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
      case 'next-layout':
        fileContent = contents.getNextLayoutContent(config);
        break;
      case 'next-page':
        fileContent = contents.getNextPageContent(name, config);
        break;
      case 'store-provider':
        fileContent = contents.getStoreProviderContent(config);
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
        if (name === 'index-html') fileContent = contents.getIndexHtmlContent(config);
        if (name === 'vite-config') fileContent = contents.getViteConfigContent(config);
        if (name === 'next-config') fileContent = contents.getNextConfigContent(config);
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
    console.log(cyan('     npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer'));
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

  // Auto install dependencies if selected
  if (config.installDeps) {
    installDependencies(config);
  }
}

function detectPackageManager() {
  if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(process.cwd(), 'bun.lockb'))) return 'bun';
  return 'npm';
}

function installDependencies(config) {
  const pm = detectPackageManager();
  const pkgPath = path.join(process.cwd(), 'package.json');
  
  // ANSI colors
  const boldColor = (str) => `\x1b[1m${str}\x1b[22m`;
  const cyanColor = (str) => `\x1b[36m${str}\x1b[39m`;
  const redColor = (str) => `\x1b[31m${str}\x1b[39m`;
  const greenColor = (str) => `\x1b[32m${str}\x1b[39m`;


  // 2. Read package.json to filter already installed dependencies
  let existingDeps = new Set();
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    Object.keys(pkg.dependencies || {}).forEach(d => existingDeps.add(d));
    Object.keys(pkg.devDependencies || {}).forEach(d => existingDeps.add(d));
  } catch (e) {}

  const depsToInstall = [];
  const devDepsToInstall = [];

  // Define required packages based on configuration
  if (config.framework === 'next') {
    if (!existingDeps.has('next')) depsToInstall.push('next');
    if (!existingDeps.has('react')) depsToInstall.push('react');
    if (!existingDeps.has('react-dom')) depsToInstall.push('react-dom');
    
    if (config.language === 'ts') {
      if (!existingDeps.has('typescript')) devDepsToInstall.push('typescript');
      if (!existingDeps.has('@types/react')) devDepsToInstall.push('@types/react');
      if (!existingDeps.has('@types/react-dom')) devDepsToInstall.push('@types/react-dom');
      if (!existingDeps.has('@types/node')) devDepsToInstall.push('@types/node');
    }
  } else if (config.framework === 'react') {
    if (!existingDeps.has('react')) depsToInstall.push('react');
    if (!existingDeps.has('react-dom')) depsToInstall.push('react-dom');
    
    if (!existingDeps.has('vite')) devDepsToInstall.push('vite');
    if (!existingDeps.has('@vitejs/plugin-react')) devDepsToInstall.push('@vitejs/plugin-react');
    
    if (config.language === 'ts') {
      if (!existingDeps.has('typescript')) devDepsToInstall.push('typescript');
      if (!existingDeps.has('@types/react')) devDepsToInstall.push('@types/react');
      if (!existingDeps.has('@types/react-dom')) devDepsToInstall.push('@types/react-dom');
    }
  }

  if (config.styling === 'tailwind') {
    if (!existingDeps.has('tailwindcss')) devDepsToInstall.push('tailwindcss');
    if (!existingDeps.has('@tailwindcss/postcss')) devDepsToInstall.push('@tailwindcss/postcss');
    if (!existingDeps.has('postcss')) devDepsToInstall.push('postcss');
    if (!existingDeps.has('autoprefixer')) devDepsToInstall.push('autoprefixer');
  } else if (config.styling === 'scss') {
    if (!existingDeps.has('sass')) devDepsToInstall.push('sass');
  }

  if (config.routing) {
    if (!existingDeps.has('react-router-dom')) depsToInstall.push('react-router-dom');
  }

  if (config.stateManagement === 'zustand') {
    if (!existingDeps.has('zustand')) depsToInstall.push('zustand');
  } else if (config.stateManagement === 'redux') {
    if (!existingDeps.has('@reduxjs/toolkit')) depsToInstall.push('@reduxjs/toolkit');
    if (!existingDeps.has('react-redux')) depsToInstall.push('react-redux');
  }

  // 3. Perform installations
  if (depsToInstall.length > 0) {
    console.log(cyanColor(`\n🚀 Installing dependencies: ${boldColor(depsToInstall.join(', '))}...`));
    const installCmd = getInstallCmd(pm, depsToInstall, false);
    try {
      execSync(installCmd, { stdio: 'inherit' });
      console.log(greenColor(`  ✔ Dependencies installed successfully.`));
    } catch (e) {
      console.error(redColor(`❌ Dependency installation failed: ${e.message}`));
    }
  }

  if (devDepsToInstall.length > 0) {
    console.log(cyanColor(`\n🚀 Installing devDependencies: ${boldColor(devDepsToInstall.join(', '))}...`));
    const installCmd = getInstallCmd(pm, devDepsToInstall, true);
    try {
      execSync(installCmd, { stdio: 'inherit' });
      console.log(greenColor(`  ✔ devDependencies installed successfully.`));
    } catch (e) {
      console.error(redColor(`❌ devDependency installation failed: ${e.message}`));
    }
  }
}

function getInstallCmd(pm, list, isDev) {
  const items = list.join(' ');
  if (pm === 'yarn') {
    return isDev ? `yarn add -D ${items}` : `yarn add ${items}`;
  }
  if (pm === 'pnpm') {
    return isDev ? `pnpm add -D ${items}` : `pnpm add ${items}`;
  }
  if (pm === 'bun') {
    return isDev ? `bun add -d ${items}` : `bun add ${items}`;
  }
  return isDev ? `npm install -D ${items}` : `npm install ${items}`;
}
