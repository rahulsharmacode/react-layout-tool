const contents = {
    'public/assets/logo.png': '',
    'public/css/main.css': `/* Main CSS file */\nbody {\n    margin: 0;\n    padding: 0;\n    font-family: Arial, sans-serif;\n}`,

    'src/pages/dashboard/index.jsx': `import React from 'react';\n\nconst Dashboard = () => {\n    return <div>Dashboard Page</div>;\n};\n\nexport default Dashboard;`,
    'src/pages/home/index.jsx': `import React from 'react';\n\nconst Home = () => {\n    return <div>Home Page</div>;\n};\n\nexport default Home;`,

    'src/utils/components/header/index.jsx': `import React from 'react';\n\nconst Header = () => {\n    return <header>Header Component</header>;\n};\n\nexport default Header;`,
    'src/utils/components/footer/index.jsx': `import React from 'react';\n\nconst Footer = () => {\n    return <footer>Footer Component</footer>;\n};\n\nexport default Footer;`,
    'src/utils/components/footer/index.function.jsx': `import React from 'react';\n\nexport function FooterFunction() {\n    return <footer>Footer Function Component</footer>;\n};`,
    'src/utils/components/sidebar/index.jsx': `import React from 'react';\n\nconst Sidebar = () => {\n    return <aside>Sidebar Component</aside>;\n};\n\nexport default Sidebar;`,

    'src/utils/helper/index.helper.jsx': `// Helper functions\n\nexport const helperFunction = () => {\n    // Implementation\n};`,
    'src/utils/hook/index.hook.jsx': `import { useState, useEffect } from 'react';\n\nexport const useCustomHook = () => {\n    const [state, setState] = useState(null);\n\n    useEffect(() => {\n        // Effect logic\n    }, []);\n\n    return [state, setState];\n};`,
    'src/utils/interface/index.interface.jsx': `// Interface definition\n\nexport interface CustomInterface {\n    id: number;\n    name: string;\n};`,
    'src/utils/private/index.private.jsx': `import React from 'react';\n\nconst PrivateComponent = () => {\n    return <div>Private Component</div>;\n};\n\nexport default PrivateComponent;`,

    'src/utils/services/index.private.jsx': `// Private service functions\n\nexport const privateService = () => {\n    // Implementation\n};`,
    'src/utils/services/api.private.jsx': `// API service functions\n\nexport const apiService = () => {\n    // Implementation\n};`,

    'src/utils/states/atom.jsx': `import { atom } from 'recoil';\n\nexport const myAtom = atom({\n    key: 'myAtom',\n    default: null,\n});`,
    'src/utils/states/selector.jsx': `import { selector } from 'recoil';\n\nexport const mySelector = selector({\n    key: 'mySelector',\n    get: ({ get }) => {\n        const atomValue = get(myAtom);\n        return atomValue;\n    },\n});`,
};

export { contents };