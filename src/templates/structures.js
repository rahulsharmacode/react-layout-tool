/**
 * Structure definitions for different layout architectures.
 * Dynamically constructs file list based on user choices.
 */

export function getStructure(config) {
  const { layout, language, styling, routing, stateManagement, pathAliases } = config;
  
  const isTS = language === 'ts';
  const cmpExt = isTS ? 'tsx' : 'jsx';
  const codeExt = isTS ? 'ts' : 'js';
  const styleExt = styling === 'tailwind' ? null : styling;

  const files = {};

  // 1. CONFIG & TS FILES (Best Practice: Path Aliases)
  if (pathAliases) {
    if (isTS) {
      files['tsconfig.json'] = { type: 'config', name: 'tsconfig' };
      files['tsconfig.node.json'] = { type: 'config', name: 'tsconfig.node' };
    } else {
      files['jsconfig.json'] = { type: 'config', name: 'jsconfig' };
    }
  }

  // 2. TAILWIND CONFIG (Best Practice: Styling Configs)
  if (styling === 'tailwind') {
    files['tailwind.config.js'] = { type: 'config', name: 'tailwind' };
    files['postcss.config.js'] = { type: 'config', name: 'postcss' };
  }

  // 3. BASE ENTRY FILES
  files[`src/main.${cmpExt}`] = { type: 'main' };
  files[`src/App.${cmpExt}`] = { type: 'app' };
  
  const mainStyleExt = styling === 'tailwind' ? 'css' : styling;
  files[`src/index.${mainStyleExt}`] = { type: 'style', name: 'index' };

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

  // 4. ROUTING MODULE (Best Practice: Centralized Routes Setup)
  if (routing) {
    files[`src/routes/index.${cmpExt}`] = { type: 'router' };
  }

  // 5. GLOBAL STATE MANAGEMENT (Best Practice: Unidirectional / Clean Store separation)
  if (stateManagement === 'zustand') {
    files[`src/store/useAppStore.${codeExt}`] = { type: 'store', name: 'zustand' };
  } else if (stateManagement === 'redux') {
    files[`src/store/index.${codeExt}`] = { type: 'store', name: 'redux' };
    files[`src/store/slices/counterSlice.${codeExt}`] = { type: 'slice', name: 'counterSlice' };
  } else if (stateManagement === 'context') {
    files[`src/context/ThemeContext.${cmpExt}`] = { type: 'context', name: 'ThemeContext' };
  }

  // 6. GLOBAL CONFIG & TYPES (Best Practice: Environment constants and Type safety)
  files[`src/config/constants.${codeExt}`] = { type: 'config', name: 'constants' };
  if (isTS) {
    files[`src/types/index.d.ts`] = { type: 'config', name: 'types' };
  }

  // --------------------------------------------------
  // ARCHITECTURE 1: FEATURE-BASED / DOMAIN-DRIVEN (Recommended Best Practice)
  // --------------------------------------------------
  if (layout === 'feature') {
    // Shared global UI components
    addComponent('src/components/ui', 'Button');
    
    // Shared global layouts
    addComponent('src/layouts', 'MainLayout');
    
    // Shared global custom hooks, services, and utils
    files[`src/hooks/useToggle.${codeExt}`] = { type: 'hook', name: 'useToggle' };
    files[`src/services/api.${codeExt}`] = { type: 'service', name: 'api' };
    files[`src/utils/formatters.${codeExt}`] = { type: 'util', name: 'formatters' };

    // Page route managers
    addPage('Home');
    addPage('Dashboard');

    // Feature Modules: Authentication
    addComponent('src/features/auth/components', 'LoginForm');
    files[`src/features/auth/hooks/useAuth.${codeExt}`] = { type: 'hook', name: 'useAuth' };
    files[`src/features/auth/services/authApi.${codeExt}`] = { type: 'service', name: 'authApi' };

    // Feature Modules: Dashboard / Metrics
    addComponent('src/features/dashboard/components', 'StatsGrid');
    addComponent('src/features/dashboard/components', 'RecentActivity');
  }

  // --------------------------------------------------
  // ARCHITECTURE 2: STANDARD LAYERED (Clean Separation of Technical layers)
  // --------------------------------------------------
  else if (layout === 'layered') {
    // Global components split by layout vs ui
    addComponent('src/components/ui', 'Button');
    addComponent('src/layouts', 'MainLayout');
    
    addPage('Home');
    addPage('Dashboard');
    
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

    addPage('Home');
    addPage('Dashboard');

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
    
    addPage('Home');
    
    files[`src/hooks/useToggle.${codeExt}`] = { type: 'hook', name: 'useToggle' };
    files[`src/utils/helpers.${codeExt}`] = { type: 'util', name: 'helpers' };
  }

  return files;
}
