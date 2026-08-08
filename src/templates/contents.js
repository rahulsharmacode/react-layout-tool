/**
 * Dynamic content generator for React and Next.js files.
 * Generates boilerplate code with educational best practice headers.
 */

const tsType = (lang, typeStr) => (lang === 'ts' ? typeStr : '');

const getHeader = (fileName, explanation) => `/**
 * ${fileName}
 * 
 * 💡 BEST PRACTICE TIP:
 * ${explanation}
 */\n\n`;

export function getAppContent({ language, styling, routing, stateManagement }) {
  const isTS = language === 'ts';
  const explanation = `This is the root component of your React tree. In a clean architecture, the App component should remain minimalist, serving primarily as a container for global configurations and providers (e.g., State Providers, Theme Providers, and RouterProvider).`;
  
  let imports = `import React from 'react';\n`;
  let body = '';

  if (styling !== 'tailwind') {
    imports += `import './App.${styling}';\n`;
  }

  if (routing) {
    imports += `import { RouterProvider } from 'react-router-dom';\nimport { router } from './routes';\n`;
  } else {
    imports += `import MainLayout from './layouts/MainLayout';\nimport Home from './pages/Home';\n`;
  }

  if (stateManagement === 'context') {
    imports += `import { ThemeProvider } from './context/ThemeContext';\n`;
  } else if (stateManagement === 'redux') {
    imports += `import { Provider } from 'react-redux';\nimport { store } from './store';\n`;
  }

  if (routing) {
    let content = `<RouterProvider router={router} />`;
    if (stateManagement === 'redux') {
      content = `<Provider store={store}>${content}</Provider>`;
    }
    if (stateManagement === 'context') {
      content = `<ThemeProvider>${content}</ThemeProvider>`;
    }
    body = `  return (\n    ${content}\n  );\n`;
  } else {
    let mainContent = `
      <MainLayout>
        <Home />
      </MainLayout>`;
    
    if (stateManagement === 'redux') {
      mainContent = `<Provider store={store}>${mainContent}</Provider>`;
    }
    if (stateManagement === 'context') {
      mainContent = `<ThemeProvider>${mainContent}</ThemeProvider>`;
    }
    
    body = `  return (\n    ${mainContent}\n  );\n`;
  }

  return `${getHeader(`src/App.${isTS ? 'tsx' : 'jsx'}`, explanation)}${imports}\nconst App${tsType(language, ': React.FC')} = () => {\n${body}};\n\nexport default App;\n`;
}

export function getMainContent({ language, styling }) {
  const isTS = language === 'ts';
  const explanation = `This is the entry point for the bundler (e.g., Vite, Webpack). Keep this file thin; its sole responsibility should be locating the root DOM node and mounting the main React App.`;
  
  return `${getHeader(`src/main.${isTS ? 'tsx' : 'jsx'}`, explanation)}import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.${styling === 'tailwind' ? 'css' : styling}';

ReactDOM.createRoot(document.getElementById('root')${isTS ? '!' : ''}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
}

export function getIndexCss(styling) {
  if (styling === 'tailwind') {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-50 text-slate-900 antialiased transition-colors duration-200;
  }
  
  body.dark {
    @apply bg-slate-950 text-slate-50;
  }
}
`;
  }

  return `/* Base styling */
:root {
  --primary-color: #6366f1;
  --primary-hover: #4f46e5;
  --bg-color: #f8fafc;
  --text-color: #0f172a;
  --card-bg: #ffffff;
  --border-color: #e2e8f0;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}
`;
}

export function getComponentContent(name, config) {
  const { framework, language, styling, stateManagement } = config;
  const isTS = language === 'ts';
  const isTailwind = styling === 'tailwind';
  const isNext = framework === 'next';
  
  let imports = `import React from 'react';\n`;
  if (!isTailwind) {
    imports += `import './${name}.${styling}';\n`;
  }
  
  let stateHooks = '';
  if (stateManagement === 'zustand') {
    imports += `import { useAppStore } from '${isNext ? '@/store/useAppStore' : '../../store/useAppStore'}';\n`;
    stateHooks = `  const { count, increment } = useAppStore();\n`;
  } else if (stateManagement === 'redux') {
    imports += `import { useSelector, useDispatch } from 'react-redux';\nimport { increment } from '${isNext ? '@/store/slices/counterSlice' : '../../store/slices/counterSlice'}';\n`;
    stateHooks = `  const count = useSelector((state${isTS ? ': any' : ''}) => state.counter.value);\n  const dispatch = useDispatch();\n`;
  }

  let jsx = '';
  let explanation = '';
  let filename = `src/components/${name}.${isTS ? 'tsx' : 'jsx'}`;

  if (name === 'MainLayout') {
    filename = `src/layouts/MainLayout.${isTS ? 'tsx' : 'jsx'}`;
    explanation = `Layout components define the structural grid/frames of the page (header, footer, sidebars) and take children. Separating structural grids from pages allows pages to share layout configurations seamlessly.`;
    
    // In Next, layouts don't need header/footer subcomponents if layout.tsx handles them, but let's provide standard wrapping.
    jsx = isTailwind
      ? `    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {children}
      </main>
    </div>`
      : `    <div className="app-container">
      <main className="main-content">
        {children}
      </main>
    </div>`;

    const propsInterface = isTS ? 'interface MainLayoutProps {\n  children: React.ReactNode;\n}\n\n' : '';
    const componentSig = isTS ? 'React.FC<MainLayoutProps>' : '';
    
    return `${getHeader(filename, explanation)}${imports}\n${propsInterface}const MainLayout: ${componentSig} = ({ children }) => {\n  return (\n${jsx}\n  );\n};\n\nexport default MainLayout;\n`;
  }

  if (name === 'Header') {
    explanation = `Shared visual header component. Keeps header branding, navigation nodes, and layout setups modular and independent.`;
    jsx = isTailwind 
      ? `    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            React App
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="/" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm transition-colors">Home</a>
          <a href="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm transition-colors">Dashboard</a>
        </nav>
      </div>
    </header>`
      : `    <header className="app-header">
      <div className="header-container">
        <div className="logo">React App</div>
        <nav className="header-nav">
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
      </div>
    </header>`;
  } else if (name === 'Footer') {
    explanation = `Shared visual footer component. Modularized footer content keeping page designs consistent across the board.`;
    jsx = isTailwind
      ? `    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} React App. Built with best practices.</p>
      </div>
    </footer>`
      : `    <footer className="app-footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} React App. Built with best practices.</p>
      </div>
    </footer>`;
  } else if (name === 'Sidebar') {
    explanation = `Modular sidebar layout. Promotes layout flexibilities for side-anchored panels.`;
    jsx = isTailwind
      ? `    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen py-6 px-4">
      <div className="space-y-4">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</div>
        <nav className="space-y-1">
          <a href="/" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Home</a>
          <a href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Dashboard</a>
        </nav>
      </div>
    </aside>`
      : `    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
      </nav>
    </aside>`;
  } else if (name === 'Button') {
    explanation = `Global UI component. Reusable components should be highly customizable, pure, and styled using layout styles. They should not rely on feature business states directly.`;
    const props = isTS ? 'interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: "primary" | "secondary";\n}\n\n' : '';
    const componentSig = isTS ? `React.FC<ButtonProps>` : '';
    const clientDirective = (isNext && stateManagement) ? `'use client';\n\n` : '';
    
    return `${clientDirective}${getHeader(`src/components/ui/Button.${isTS ? 'tsx' : 'jsx'}`, explanation)}${imports}\n${props}const Button: ${componentSig} = ({ children, variant = 'primary', className = '', ...props }) => {\n  const baseStyle = '${isTailwind ? 'px-4 py-2 rounded-md font-medium text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2' : 'btn'}';\n  const variantStyle = variant === 'primary' \n    ? '${isTailwind ? 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500' : 'btn-primary'}'\n    : '${isTailwind ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200' : 'btn-secondary'}';\n\n  return (\n    <button className={\`\${baseStyle} \${variantStyle} \${className}\`} {...props}>\n      {children}\n    </button>\n  );\n};\n\nexport default Button;\n`;
  } else if (name === 'LoginForm') {
    filename = `src/features/auth/components/LoginForm.${isTS ? 'tsx' : 'jsx'}`;
    explanation = `Feature-specific UI Component. Keeping components local to features (e.g. auth) avoids bloating the global 'src/components' list and keeps feature scopes fully modular.`;
    const clientDirective = isNext ? `'use client';\n\n` : '';
    
    jsx = isTailwind
      ? `    <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-100 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white">Sign In</h2>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
          <input type="email" required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <input type="password" required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-transparent text-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium text-sm">
          Sign In
        </button>
      </form>
    </div>`
      : `    <div className="login-form-box">
      <h2>Sign In</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>`;
  } else if (name === 'StatsGrid') {
    filename = `src/features/dashboard/components/StatsGrid.${isTS ? 'tsx' : 'jsx'}`;
    explanation = `Dashboard layout component. Scoped directly within features/dashboard.`;
    jsx = isTailwind
      ? `    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Active Users</div>
        <div className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">12,480</div>
      </div>
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Monthly Revenue</div>
        <div className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">$45,210</div>
      </div>
      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Conversion Rate</div>
        <div className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">3.24%</div>
      </div>
    </div>`
      : `    <div className="stats-grid">
      <div className="stat-card"><h3>Active Users</h3><p>12,480</p></div>
      <div className="stat-card"><h3>Revenue</h3><p>$45,210</p></div>
    </div>`;
  } else if (name === 'RecentActivity') {
    filename = `src/features/dashboard/components/RecentActivity.${isTS ? 'tsx' : 'jsx'}`;
    explanation = `Feature component scoped to dashboard activity logs.`;
    jsx = isTailwind
      ? `    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Recent Activity</h3>
      <ul className="divide-y divide-slate-100 dark:divide-slate-700 text-xs text-slate-500">
        <li className="py-2">User John Doe signed up</li>
        <li className="py-2">System updated to version 1.0.6</li>
        <li className="py-2">Invoice #2488 paid</li>
      </ul>
    </div>`
      : `    <div className="activity-card"><h3>Activity</h3><ul><li>User signed up</li></ul></div>`;
  } else {
    explanation = `Fallback modular UI component.`;
    const clientDirective = (isNext && stateManagement) ? `'use client';\n\n` : '';
    jsx = isTailwind
      ? `    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-100 dark:border-slate-700">
      <h3 className="text-lg font-bold">${name} Component</h3>
      ${stateHooks ? `<div className="mt-4 flex items-center gap-4">
        <span>Count: {count}</span>
        <button 
          onClick={() => ${stateManagement === 'zustand' ? 'increment()' : 'dispatch(increment())'}}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
        >
          Increment
        </button>
      </div>` : ''}
    </div>`
      : `    <div className="card">
      <h3>${name} Component</h3>
      ${stateHooks ? `<div className="store-demo">
        <span>Count: {count}</span>
        <button onClick={() => ${stateManagement === 'zustand' ? 'increment()' : 'dispatch(increment())'}}>Increment</button>
      </div>` : ''}
    </div>`;
    return `${clientDirective}${getHeader(filename, explanation)}${imports}\nconst ${name}${isTS ? ': React.FC' : ''} = () => {\n${stateHooks}\n  return (\n${jsx}\n  );\n};\n\nexport default ${name};\n`;
  }

  return `${getHeader(filename, explanation)}${imports}\nconst ${name}${isTS ? ': React.FC' : ''} = () => {\n${stateHooks}\n  return (\n${jsx}\n  );\n};\n\nexport default ${name};\n`;
}

export function getComponentStyle(name) {
  if (name === 'Header') {
    return `.app-header {
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-color);
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}
.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}
.header-nav a {
  margin-left: 1.5rem;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.2s;
}
.header-nav a:hover {
  color: var(--primary-color);
}
`;
  } else if (name === 'Footer') {
    return `.app-footer {
  background-color: #ffffff;
  border-top: 1px solid var(--border-color);
  padding: 1.5rem;
  text-align: center;
  color: #64748b;
  margin-top: auto;
}
`;
  } else if (name === 'Sidebar') {
    return `.app-sidebar {
  width: 250px;
  background-color: #ffffff;
  border-right: 1px solid var(--border-color);
  height: calc(100vh - 64px);
  padding: 1.5rem;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.sidebar-nav a {
  text-decoration: none;
  color: var(--text-color);
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}
.sidebar-nav a:hover {
  background-color: #f1f5f9;
  color: var(--primary-color);
}
`;
  } else if (name === 'Button') {
    return `.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
  transition: all 0.2s;
}
.btn-primary {
  background-color: var(--primary-color);
  color: white;
}
.btn-primary:hover {
  background-color: var(--primary-hover);
}
.btn-secondary {
  background-color: #f1f5f9;
  color: #334155;
}
.btn-secondary:hover {
  background-color: #e2e8f0;
}
`;
  }
  return `.card {
  padding: 1.5rem;
  background-color: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
`;
}

export function getPageContent(name, config) {
  const { language, styling, stateManagement } = config;
  const isTS = language === 'ts';
  const isTailwind = styling === 'tailwind';
  const explanation = `Page components represent layout-level grids tied to page routes. Keep layouts structural; components in pages should import feature components and coordinate grids.`;
  
  let imports = `import React from 'react';\n`;
  
  if (name === 'Dashboard' && stateManagement) {
    if (stateManagement === 'zustand') {
      imports += `import { useAppStore } from '../store/useAppStore';\n`;
    } else if (stateManagement === 'redux') {
      imports += `import { useSelector, useDispatch } from 'react-redux';\nimport { increment, decrement } from '../store/slices/counterSlice';\n`;
    }
  }

  let body = '';
  
  if (name === 'Home') {
    body = isTailwind
      ? `    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Welcome to Your React App</h1>
        <p className="text-lg text-indigo-100 max-w-2xl mb-6">
          This project is scaffolded using optimized folder structures and developer best practices. Explore different directories to see details.
        </p>
        <div className="flex gap-4">
          <a href="/dashboard" className="px-5 py-2.5 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-indigo-50 transition-colors">
            Go to Dashboard
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Folder Structure</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A standardized layout configured specifically for easy scaling and domain separation.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Path Aliases</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Absolute imports enabled with prefixing like \`@/components\` for clean import statements.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Best Practices</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Optimized for fast bundling, lint configs, proper separation of services and UI components.
          </p>
        </div>
      </div>
    </div>`
      : `    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Your React App</h1>
        <p>This project is scaffolded using optimized folder structures and developer best practices.</p>
        <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Folder Structure</h3>
          <p>A standardized layout configured specifically for easy scaling and domain separation.</p>
        </div>
        <div className="feature-card">
          <h3>Path Aliases</h3>
          <p>Absolute imports enabled using @/ prefixing for clean import statements.</p>
        </div>
        <div className="feature-card">
          <h3>Best Practices</h3>
          <p>Optimized for fast bundling, lint configs, and proper code layering.</p>
        </div>
      </div>
    </div>`;
  } else if (name === 'Dashboard') {
    let stateControls = '';
    if (stateManagement === 'zustand') {
      stateControls = `
  const { count, increment, decrement } = useAppStore();`;
    } else if (stateManagement === 'redux') {
      stateControls = `
  const count = useSelector((state${isTS ? ': any' : ''}) => state.counter.value);
  const dispatch = useDispatch();`;
    }

    const stateJsx = stateManagement
      ? isTailwind
        ? `\n      <div className="mt-8 p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl max-w-md shadow-sm">
        <h3 className="font-semibold text-lg mb-2">State Management Demo</h3>
        <p className="text-sm text-slate-500 mb-4">Powered by ${stateManagement === 'zustand' ? 'Zustand' : 'Redux Toolkit'}</p>
        <div className="flex items-center gap-4">
          <button onClick={() => ${stateManagement === 'zustand' ? 'decrement()' : 'dispatch(decrement())'}} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded">-</button>
          <span className="font-bold text-xl w-12 text-center">{count}</span>
          <button onClick={() => ${stateManagement === 'zustand' ? 'increment()' : 'dispatch(increment())'}} className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded">+</button>
        </div>
      </div>`
        : `\n      <div className="state-demo-box">
        <h3>State Management Demo</h3>
        <p>Powered by ${stateManagement === 'zustand' ? 'Zustand' : 'Redux Toolkit'}</p>
        <div className="controls">
          <button onClick={() => ${stateManagement === 'zustand' ? 'decrement()' : 'dispatch(decrement())'}}>-</button>
          <span className="count">{count}</span>
          <button onClick={() => ${stateManagement === 'zustand' ? 'increment()' : 'dispatch(increment())'}}>+</button>
        </div>
      </div>`
      : '';

    body = isTailwind
      ? `    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Dashboard</h1>
      <p className="text-slate-500 dark:text-slate-400">Manage your application metrics and settings here.</p>${stateJsx}
    </div>`
      : `    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p>Manage your application metrics and settings here.</p>${stateJsx}
    </div>`;
      
    return `${getHeader(`src/pages/Dashboard.${isTS ? 'tsx' : 'jsx'}`, explanation)}${imports}\nconst Dashboard${isTS ? ': React.FC' : ''} = () => {${stateControls}\n  return (\n${body}\n  );\n};\n\nexport default Dashboard;\n`;
  } else {
    body = `    <div>\n      <h1>${name} Page</h1>\n    </div>`;
  }

  return `${getHeader(`src/pages/${name}.${isTS ? 'tsx' : 'jsx'}`, explanation)}${imports}\nconst ${name}${isTS ? ': React.FC' : ''} = () => {\n  return (\n${body}\n  );\n};\n\nexport default ${name};\n`;
}

export function getNextLayoutContent(config) {
  const { language, styling, stateManagement } = config;
  const isTS = language === 'ts';
  const isTailwind = styling === 'tailwind';
  const explanation = `This is the root layout for the Next.js App Router. It defines the base HTML structure, document fonts, and houses root-level provider wraps (e.g. state context wrappers).`;

  let imports = `import React from 'react';\nimport './globals.${styling === 'tailwind' ? 'css' : styling}';\n`;
  
  if (stateManagement === 'context') {
    imports += `import { ThemeProvider } from '../context/ThemeContext';\n`;
  } else if (stateManagement === 'redux') {
    imports += `import StoreProvider from '../store/StoreProvider';\n`;
  }

  let wrapStart = '';
  let wrapEnd = '';

  if (stateManagement === 'context') {
    wrapStart = '<ThemeProvider>';
    wrapEnd = '</ThemeProvider>';
  } else if (stateManagement === 'redux') {
    wrapStart = '<StoreProvider>';
    wrapEnd = '</StoreProvider>';
  }

  const layoutSig = isTS ? 'children: React.ReactNode' : 'children';

  return `${getHeader(`src/app/layout.${isTS ? 'tsx' : 'jsx'}`, explanation)}${imports}
export const metadata = {
  title: 'Next.js Best Practices App',
  description: 'Scaffolded using react-layout-tool',
};

export default function RootLayout({
  children,
}${isTS ? `: { ${layoutSig} }` : ''}) {
  return (
    <html lang="en">
      <body className="${isTailwind ? 'antialiased' : ''}">
        ${wrapStart ? `${wrapStart}{children}${wrapEnd}` : '{children}'}
      </body>
    </html>
  );
}
`;
}

export function getNextPageContent(name, config) {
  const { language, styling, stateManagement } = config;
  const isTS = language === 'ts';
  const isTailwind = styling === 'tailwind';
  
  // Set up imports and state setups
  let imports = `import React from 'react';\n`;
  let clientDirective = '';
  let stateHooks = '';

  const isDashboard = name === 'Dashboard';
  const pageRoute = isDashboard ? 'src/app/dashboard/page' : 'src/app/page';

  if (isDashboard && stateManagement) {
    clientDirective = `'use client';\n\n`;
    if (stateManagement === 'zustand') {
      imports += `import { useAppStore } from '@/store/useAppStore';\n`;
      stateHooks = `  const { count, increment, decrement } = useAppStore();\n`;
    } else if (stateManagement === 'redux') {
      imports += `import { useSelector, useDispatch } from 'react-redux';\nimport { increment, decrement } from '@/store/slices/counterSlice';\n`;
      stateHooks = `  const count = useSelector((state${isTS ? ': any' : ''}) => state.counter.value);\n  const dispatch = useDispatch();\n`;
    }
  }

  const explanation = `Page view for the Next.js App Router. By default, Next.js components are Server Components. If client side states or handlers (e.g. hooks, stores) are needed, mark the file with 'use client' directive.`;

  let jsx = '';
  if (isDashboard) {
    const stateJsx = stateManagement
      ? isTailwind
        ? `\n      <div className="mt-8 p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl max-w-md shadow-sm">
        <h3 className="font-semibold text-lg mb-2">State Management Demo</h3>
        <p className="text-sm text-slate-500 mb-4">Powered by ${stateManagement === 'zustand' ? 'Zustand' : 'Redux Toolkit'}</p>
        <div className="flex items-center gap-4">
          <button onClick={() => ${stateManagement === 'zustand' ? 'decrement()' : 'dispatch(decrement())'}} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded">-</button>
          <span className="font-bold text-xl w-12 text-center">{count}</span>
          <button onClick={() => ${stateManagement === 'zustand' ? 'increment()' : 'dispatch(increment())'}} className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded">+</button>
        </div>
      </div>`
        : `\n      <div className="state-demo-box">
        <h3>State Management Demo</h3>
        <p>Powered by ${stateManagement === 'zustand' ? 'Zustand' : 'Redux Toolkit'}</p>
        <div className="controls">
          <button onClick={() => ${stateManagement === 'zustand' ? 'decrement()' : 'dispatch(decrement())'}}>-</button>
          <span className="count">{count}</span>
          <button onClick={() => ${stateManagement === 'zustand' ? 'increment()' : 'dispatch(increment())'}}>+</button>
        </div>
      </div>`
      : '';

    jsx = isTailwind
      ? `    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Dashboard</h1>
      <p className="text-slate-500 dark:text-slate-400">Manage your application metrics and settings here.</p>${stateJsx}
    </div>`
      : `    <div className="dashboard-page" style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Manage your application metrics and settings here.</p>${stateJsx}
    </div>`;
  } else {
    // Root Home Page
    jsx = isTailwind
      ? `    <main className="min-h-screen p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Welcome to Your Next.js App</h1>
        <p className="text-lg text-indigo-100 max-w-2xl mb-6">
          This project is scaffolded with Next.js App Router best practices, featuring complete structure separation.
        </p>
        <div className="flex gap-4">
          <a href="/dashboard" className="px-5 py-2.5 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-indigo-50 transition-colors">
            Go to Dashboard
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Folder Structure</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A standardized layout configured specifically for easy scaling and domain separation.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Path Aliases</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Absolute imports enabled with prefixing like \`@/components\` for clean import statements.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Best Practices</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Optimized for Next.js App Router, separating Client and Server components.
          </p>
        </div>
      </div>
    </main>`
      : `    <main className="home-page" style={{ padding: '2rem' }}>
      <h1>Welcome to Your Next.js App</h1>
      <p>This project is scaffolded using optimized folder structures and developer best practices.</p>
      <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
    </main>`;
  }

  return `${clientDirective}${getHeader(`${pageRoute}.${isTS ? 'tsx' : 'jsx'}`, explanation)}${imports}
export default function Page() {
${stateHooks}  return (
${jsx}
  );
}
`;
}

export function getStoreProviderContent({ language }) {
  const isTS = language === 'ts';
  const explanation = `In the Next.js App Router, Redux Providers must be Client Components ('use client') because they rely on React Context. Standard practice dictates wrapping the 'Provider' wrapper in a dedicated client component file.`;

  return `'use client';\n\n${getHeader(`src/store/StoreProvider.${isTS ? 'tsx' : 'jsx'}`, explanation)}import React from 'react';
import { Provider } from 'react-redux';
import { store } from './index';

export default function StoreProvider({
  children,
}${isTS ? ': { children: React.ReactNode }' : ''}) {
  return <Provider store={store}>{children}</Provider>;
}
`;
}

export function getHookContent(name, { language }) {
  const isTS = language === 'ts';
  let explanation = '';
  
  if (name === 'useAuth') {
    explanation = `Auth state hook. Houses session loading configurations, login/logout functions, and user settings, keeping UI layers purely presentation-focused.`;
    
    return `${getHeader(`src/hooks/useAuth.${isTS ? 'ts' : 'js'}`, explanation)}import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState${isTS ? '<any | null>' : ''}(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser({ id: '1', name: 'Developer User', email: 'dev@example.com' });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const login = async () => {
    setUser({ id: '1', name: 'Developer User', email: 'dev@example.com' });
  };

  const logout = () => {
    setUser(null);
  };

  return { user, loading, login, logout, isAuthenticated: !!user };
};
`;
  }

  explanation = `A reusable global custom state hook. Encapsulating basic utilities (e.g. toggles, fetch hooks, click handlers) promotes code dryness and ease of testability.`;
  return `${getHeader(`src/hooks/useToggle.${isTS ? 'ts' : 'js'}`, explanation)}import { useState } from 'react';

export const useToggle = (initialValue${isTS ? ': boolean' : ''} = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue((v) => !v);
  return [value, toggle]${isTS ? ' as const' : ''};
};
`;
}

export function getServiceContent({ language, name }) {
  const isTS = language === 'ts';
  const isAuth = name === 'authApi';
  const explanation = isAuth
    ? `Feature-specific API service. Connects to feature-related API nodes keeping API setups grouped by features rather than globally centralized.`
    : `Global API service. Consolidates request utilities (headers, base URLs, interceptors) to isolate HTTP frameworks from visual components.`;
  
  const filename = isAuth ? `src/features/auth/services/authApi.${isTS ? 'ts' : 'js'}` : `src/services/api.${isTS ? 'ts' : 'js'}`;

  if (isAuth) {
    return `${getHeader(filename, explanation)}import { api } from '${isAuth ? '../../../services/api' : 'api'}';

export const authApi = {
  async login(credentials${isTS ? ': any' : ''}) {
    return api.post('/auth/login', credentials);
  },
  
  async getCurrentUser() {
    return api.get('/auth/me');
  }
};
`;
  }

  return `${getHeader(filename, explanation)}/**
 * Simple Axios-like client wrapper for API requests.
 */

const BASE_URL = 'https://api.example.com';

export const api = {
  async get${isTS ? '<T>' : ''}(endpoint${isTS ? ': string' : ''})${isTS ? ': Promise<T>' : ''} {
    const response = await fetch(\`\${BASE_URL}\${endpoint}\`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    return response.json();
  },

  async post${isTS ? '<T, U = any>' : ''}(endpoint${isTS ? ': string' : ''}, data${isTS ? ': U' : ''})${isTS ? ': Promise<T>' : ''} {
    const response = await fetch(\`\${BASE_URL}\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    return response.json();
  }
};
`;
}

export function getUtilContent({ language, name }) {
  const isTS = language === 'ts';
  const isFormatters = name === 'formatters';
  const filename = isFormatters ? `src/utils/formatters.${isTS ? 'ts' : 'js'}` : `src/utils/helpers.${isTS ? 'ts' : 'js'}`;
  const explanation = `Utility functions are pure, deterministic side-effect free operations. Writing isolated helpers simplifies modular unit testing.`;

  return `${getHeader(filename, explanation)}/**
 * Common formatting and helper utilities.
 */

export const formatDate = (date${isTS ? ': Date | string | number' : ''}) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
};

export const cn = (...classes${isTS ? ': any[]' : ''}) => {
  return classes.filter(Boolean).join(' ');
};
`;
}

export function getZustandContent({ framework, language }) {
  const isTS = language === 'ts';
  const isNext = framework === 'next';
  const clientDirective = isNext ? `'use client';\n\n` : '';
  const explanation = `Global State Store. Uses lightweight store setups for sharing domain matrices across non-nested visual components.`;
  
  if (isTS) {
    return `${clientDirective}${getHeader('src/store/useAppStore.ts', explanation)}import { create } from 'zustand';

interface AppState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
`;
  }
  
  return `${clientDirective}${getHeader('src/store/useAppStore.js', explanation)}import { create } from 'zustand';

export const useAppStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
`;
}

export function getReduxContent({ language }) {
  const isTS = language === 'ts';
  const explanation = `Centralized Redux Store Configuration. Coordinates Redux slice middleware configurations.`;
  
  if (isTS) {
    return `${getHeader('src/store/index.ts', explanation)}import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;
  }
  
  return `${getHeader('src/store/index.js', explanation)}import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
`;
}

export function getReduxSliceContent({ language }) {
  const isTS = language === 'ts';
  const explanation = `Redux State Slice. Co-locates actions, reducers, and initial state objects keeping state branches neat and predictable.`;
  
  let sliceCode = `${getHeader(`src/store/slices/counterSlice.${isTS ? 'ts' : 'js'}`, explanation)}import { createSlice } from '@reduxjs/toolkit';\n\n`;
  if (isTS) {
    sliceCode += `interface CounterState {\n  value: number;\n}\n\nconst initialState: CounterState = {\n  value: 0,\n};\n\n`;
  } else {
    sliceCode += `const initialState = {\n  value: 0,\n};\n\n`;
  }

  sliceCode += `export const counterSlice = createSlice({\n  name: 'counter',\n  initialState,\n  reducers: {\n    increment: (state) => {\n      state.value += 1;\n    },\n    decrement: (state) => {\n      state.value -= 1;\n    },\n    incrementByAmount: (state, action) => {\n      state.value += action.payload;\n    },\n  },\n});\n\nexport const { increment, decrement, incrementByAmount } = counterSlice.actions;\nexport default counterSlice.reducer;\n`;
  
  return sliceCode;
}

export function getContextContent({ framework, language }) {
  const isTS = language === 'ts';
  const isNext = framework === 'next';
  const clientDirective = isNext ? `'use client';\n\n` : '';
  const explanation = `React Context Provider. Promotes theme state sharing across deep trees without props-drilling.`;
  
  if (isTS) {
    return `${clientDirective}${getHeader('src/context/ThemeContext.tsx', explanation)}import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
`;
  }

  return `${clientDirective}${getHeader('src/context/ThemeContext.jsx', explanation)}import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
`;
}

export function getRouterContent({ language }) {
  const isTS = language === 'ts';
  const explanation = `Central Routing Setup. Centralizing routing makes application layouts declarative, simple to inspect, and highly scale-ready.`;
  
  return `${getHeader(`src/routes/index.${isTS ? 'tsx' : 'jsx'}`, explanation)}import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
]);
`;
}

export function getConstantsContent({ language }) {
  const isTS = language === 'ts';
  const explanation = `Central configuration values and environment variables. Centralizing settings keeps API URLs, timeouts, and page bounds robust and consistent.`;
  
  return `${getHeader(`src/config/constants.${isTS ? 'ts' : 'js'}`, explanation)}export const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'https://api.example.com';
export const APP_TITLE = 'React Best Practices App';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
};

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};
`;
}

export function getTypesDeclaration() {
  return `/**
 * Global TypeScript Type definitions.
 * 
 * 💡 BEST PRACTICE TIP:
 * Place global type declarations and interfaces here. This ensures type safety
 * across modules without needing to import types individually.
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}
`;
}

export function getTailwindConfig(isTS) {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        }
      }
    },
  },
  plugins: [],
}
`;
}

export function getPostcssConfig() {
  return `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
}

export function getJsConfig() {
  return `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
`;
}

export function getTsConfig() {
  return `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Aliasing */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "next-env.d.ts", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;
}

export function getTsconfigNodeConfig() {
  return `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
`;
}

export function getIndexHtmlContent({ language }) {
  const ext = language === 'ts' ? 'tsx' : 'jsx';
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${ext}"></script>
  </body>
</html>
`;
}

export function getViteConfigContent() {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
`;
}

export function getNextConfigContent() {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`;
}


