/**
 * Structure definitions for different layout architectures.
 * Dynamically constructs file list based on user choices.
 */

export function getStructure(config) {
  const { framework, layout, language, styling, routing, stateManagement, pathAliases } = config;
  
  const isTS = language === 'ts';
  const cmpExt = isTS ? 'tsx' : 'jsx';
  const codeExt = isTS ? 'ts' : 'js';
  const styleExt = styling === 'tailwind' ? null : styling;
  const isNext = framework === 'next';

  const files = {};

  // 1. CONFIG & TS FILES (Best Practice: Path Aliases)
  if (pathAliases) {
    if (isTS) {
      files['tsconfig.json'] = { type: 'config', name: 'tsconfig' };
      if (!isNext) {
        files['tsconfig.node.json'] = { type: 'config', name: 'tsconfig.node' };
      }
    } else {
      files['jsconfig.json'] = { type: 'config', name: 'jsconfig' };
    }
  }

  // 2. TAILWIND CONFIG (Best Practice: Styling Configs)
  if (styling === 'tailwind') {
    files['tailwind.config.js'] = { type: 'config', name: 'tailwind' };
    files['postcss.config.js'] = { type: 'config', name: 'postcss' };
  }

  // 3. PROJECT BUNDLER FILES (Best Practice: Working out of the box)
  if (isNext) {
    files['next.config.mjs'] = { type: 'config', name: 'next-config' };
  } else {
    files['index.html'] = { type: 'config', name: 'index-html' };
    files[`vite.config.${codeExt}`] = { type: 'config', name: 'vite-config' };
  }

  // 4. BASE ENTRY FILES
  const mainStyleExt = styling === 'tailwind' ? 'css' : styling;
  if (isNext) {
    // Next.js App Router Entries
    files[`src/app/layout.${cmpExt}`] = { type: 'next-layout' };
    files[`src/app/page.${cmpExt}`] = { type: 'next-page' };
    files[`src/app/globals.${mainStyleExt}`] = { type: 'style', name: 'globals' };
  } else {
    // Standard React Entries
    files[`src/main.${cmpExt}`] = { type: 'main' };
    files[`src/App.${cmpExt}`] = { type: 'app' };
    files[`src/index.${mainStyleExt}`] = { type: 'style', name: 'index' };
  }

  // Helper to add component and optional styles
  const addComponent = (pathPrefix, name) => {
    files[`${pathPrefix}/${name}.${cmpExt}`] = { type: 'component', name };
    if (styleExt) {
      files[`${pathPrefix}/${name}.${styleExt}`] = { type: 'style', name };
    }
  };

  // Helper to add page
  const addPage = (name) => {
    files[`src/pages/${name}.${cmpExt}`] = { type: 'page', name };
    if (styleExt) {
      files[`src/pages/${name}.${styleExt}`] = { type: 'style', name };
    }
  };

  // 5. ROUTING MODULE (Best Practice: Centralized Routes Setup - React only, Next handles it)
  if (routing && !isNext) {
    files[`src/routes/index.${cmpExt}`] = { type: 'router' };
  }

  // 6. GLOBAL STATE MANAGEMENT (Best Practice: Unidirectional / Clean Store separation)
  if (stateManagement === 'zustand') {
    files[`src/store/useAppStore.${codeExt}`] = { type: 'store', name: 'zustand' };
  } else if (stateManagement === 'redux') {
    files[`src/store/index.${codeExt}`] = { type: 'store', name: 'redux' };
    files[`src/store/slices/counterSlice.${codeExt}`] = { type: 'slice', name: 'counterSlice' };
    if (isNext) {
      files[`src/store/StoreProvider.${cmpExt}`] = { type: 'store-provider', name: 'StoreProvider' };
    }
  } else if (stateManagement === 'context') {
    files[`src/context/ThemeContext.${cmpExt}`] = { type: 'context', name: 'ThemeContext' };
  }

  // 7. GLOBAL CONFIG & TYPES (Best Practice: Environment constants and Type safety)
  files[`src/config/constants.${codeExt}`] = { type: 'config', name: 'constants' };
  if (isTS) {
    files[`src/types/index.d.ts`] = { type: 'config', name: 'types' };
  }

  // --------------------------------------------------
  // ARCHITECTURE 1: FEATURE-BASED / DOMAIN-DRIVEN (Recommended Best Practice)
  // --------------------------------------------------
  if (layout === 'feature') {
    addComponent('src/components/ui', 'Button');
    addComponent('src/layouts', 'MainLayout');
    
    files[`src/hooks/useToggle.${codeExt}`] = { type: 'hook', name: 'useToggle' };
    files[`src/services/api.${codeExt}`] = { type: 'service', name: 'api' };
    files[`src/utils/formatters.${codeExt}`] = { type: 'util', name: 'formatters' };

    if (!isNext) {
      addPage('Home');
      addPage('Dashboard');
    } else {
      files[`src/app/dashboard/page.${cmpExt}`] = { type: 'next-page', name: 'Dashboard' };
    }

    addComponent('src/features/auth/components', 'LoginForm');
    files[`src/features/auth/hooks/useAuth.${codeExt}`] = { type: 'hook', name: 'useAuth' };
    files[`src/features/auth/services/authApi.${codeExt}`] = { type: 'service', name: 'authApi' };

    addComponent('src/features/dashboard/components', 'StatsGrid');
    addComponent('src/features/dashboard/components', 'RecentActivity');
  }

  // --------------------------------------------------
  // ARCHITECTURE 2: STANDARD LAYERED (Clean Separation of Technical layers)
  // --------------------------------------------------
  else if (layout === 'layered') {
    addComponent('src/components/ui', 'Button');
    addComponent('src/layouts', 'MainLayout');
    
    if (!isNext) {
      addPage('Home');
      addPage('Dashboard');
    } else {
      files[`src/app/dashboard/page.${cmpExt}`] = { type: 'next-page', name: 'Dashboard' };
    }
    
    files[`src/hooks/useAuth.${codeExt}`] = { type: 'hook', name: 'useAuth' };
    files[`src/services/api.${codeExt}`] = { type: 'service', name: 'api' };
    files[`src/utils/helpers.${codeExt}`] = { type: 'util', name: 'helpers' };
  }

  // --------------------------------------------------
  // ARCHITECTURE 3: ATOMIC DESIGN (Strict Hierarchy of UI Components)
  // --------------------------------------------------
  else if (layout === 'atomic') {
    addComponent('src/components/atoms', 'Button');
    addComponent('src/components/atoms', 'Input');
    
    addComponent('src/components/molecules', 'FormField');
    
    addComponent('src/components/organisms', 'Header');
    addComponent('src/components/organisms', 'Sidebar');
    
    addComponent('src/components/templates', 'MainLayout');

    if (!isNext) {
      addPage('Home');
      addPage('Dashboard');
    } else {
      files[`src/app/dashboard/page.${cmpExt}`] = { type: 'next-page', name: 'Dashboard' };
    }

    files[`src/hooks/useToggle.${codeExt}`] = { type: 'hook', name: 'useToggle' };
    files[`src/services/api.${codeExt}`] = { type: 'service', name: 'api' };
    files[`src/utils/helpers.${codeExt}`] = { type: 'util', name: 'helpers' };
  }

  // --------------------------------------------------
  // ARCHITECTURE 4: MINIMALIST (Clean minimal structure for prototyping)
  // --------------------------------------------------
  else if (layout === 'minimal') {
    addComponent('src/components', 'Header');
    addComponent('src/components', 'Button');
    
    if (!isNext) {
      addPage('Home');
    }
    
    files[`src/hooks/useToggle.${codeExt}`] = { type: 'hook', name: 'useToggle' };
    files[`src/utils/helpers.${codeExt}`] = { type: 'util', name: 'helpers' };
  }

  return files;
}
