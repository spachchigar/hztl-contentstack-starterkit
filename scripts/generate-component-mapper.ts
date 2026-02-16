import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

// ============================================================================
// CONFIGURATION: Add your component directories here (scans recursively)
// ============================================================================
const ALLOWED_COMPONENT_PATHS = [
  'components/authorable/shared',
  'components/ui',
  // Add more paths here as needed
  // Example: 'components/shared',
  // Example: 'components/features',
];

// Configuration for client component detection
const CLIENT_DETECTION_CONFIG = {
  // Enable verbose logging to see why components are classified as client/server
  verboseLogging: true, // Set to true to debug component classification
  // Patterns to exclude from automatic client detection (force as server components)
  excludePatterns: [
    // Example: 'NotFound.tsx',
  ],
};

// Convert relative paths to absolute paths
const registeredComponentsDirs = ALLOWED_COMPONENT_PATHS.map((dir) =>
  path.join(__dirname, '..', dir)
);


// Path to the config directory where we'll create the barrel file
const configDir = path.join(__dirname, '..', 'temp');

// Helper to get relative import path from configDir to component file
const getRelativeImportPath = (componentFilePath: string) => {
  return path.relative(configDir, componentFilePath).replace(/\\/g, '/');
};

/**
 * Check if a component is a client component by analyzing its content
 * @param filePath - Path to the component file
 * @returns true if the file is a client component
 */
const isClientComponent = (filePath: string): boolean => {
  try {
    const fileName = path.basename(filePath);

    // Check if file is in exclude patterns (force as server component)
    if (CLIENT_DETECTION_CONFIG.excludePatterns.some(pattern => fileName.includes(pattern))) {
      if (CLIENT_DETECTION_CONFIG.verboseLogging) {
        console.log(`   [SERVER] ${fileName} - Excluded by pattern`);
      }
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const reasons: string[] = [];

    // 1. Check for explicit 'use client' directive
    // Look before the first import statement (handles large doc strings)
    const firstImportIndex = content.search(/^import\s/m);
    const beforeImports = firstImportIndex !== -1
      ? content.slice(0, firstImportIndex)
      : content.slice(0, 500); // First 500 chars if no imports

    const hasUseClientDirective =
      beforeImports.includes("'use client'") ||
      beforeImports.includes('"use client"');

    if (hasUseClientDirective) {
      reasons.push("'use client' directive");
      if (CLIENT_DETECTION_CONFIG.verboseLogging) {
        console.log(`   [CLIENT] ${fileName} - ${reasons.join(', ')}`);
      }
      return true;
    }

    // 2. Check for React hooks usage (common indicators of client components)
    const reactHooks = [
      /\buseState\s*\(/,
      /\buseEffect\s*\(/,
      /\buseCallback\s*\(/,
      /\buseMemo\s*\(/,
      /\buseRef\s*\(/,
      /\buseReducer\s*\(/,
      /\buseContext\s*\(/,
      /\buseLayoutEffect\s*\(/,
      /\buseImperativeHandle\s*\(/,
      /\buseDebugValue\s*\(/,
      /\buseTransition\s*\(/,
      /\buseDeferredValue\s*\(/,
      /\buseId\s*\(/,
      /\buseSyncExternalStore\s*\(/,
      /\buseInsertionEffect\s*\(/,
      // Custom hooks that typically indicate client components
      /\buseRouter\s*\(/,
      /\busePathname\s*\(/,
      /\buseSearchParams\s*\(/,
      /\buseParams\s*\(/,
    ];

    const foundHook = reactHooks.find(hook => hook.test(content));
    if (foundHook) {
      reasons.push(`uses hook: ${foundHook.source.match(/\\b(\w+)\\s*\\\(/)?.[1]}`);
      if (CLIENT_DETECTION_CONFIG.verboseLogging) {
        console.log(`   [CLIENT] ${fileName} - ${reasons.join(', ')}`);
      }
      return true;
    }

    // 3. Check for event handlers (strong indicator of interactivity)
    const eventHandlers = [
      /\bonClick\s*=/,
      /\bonChange\s*=/,
      /\bonSubmit\s*=/,
      /\bonBlur\s*=/,
      /\bonFocus\s*=/,
      /\bonKeyDown\s*=/,
      /\bonKeyUp\s*=/,
      /\bonKeyPress\s*=/,
      /\bonMouseEnter\s*=/,
      /\bonMouseLeave\s*=/,
      /\bonMouseMove\s*=/,
      /\bonMouseDown\s*=/,
      /\bonMouseUp\s*=/,
      /\bonScroll\s*=/,
      /\bonWheel\s*=/,
      /\bonTouchStart\s*=/,
      /\bonTouchEnd\s*=/,
      /\bonTouchMove\s*=/,
      /\bonPointerDown\s*=/,
      /\bonPointerUp\s*=/,
      /\bonPointerMove\s*=/,
      /\bonDrag\s*=/,
      /\bonDrop\s*=/,
    ];

    const foundHandler = eventHandlers.find(handler => handler.test(content));
    if (foundHandler) {
      reasons.push(`uses event: ${foundHandler.source.match(/\\b(on\w+)\\s*=/)?.[1]}`);
      if (CLIENT_DETECTION_CONFIG.verboseLogging) {
        console.log(`   [CLIENT] ${fileName} - ${reasons.join(', ')}`);
      }
      return true;
    }

    // 4. Check for browser-only APIs (window, document, localStorage, etc.)
    const browserAPIs = [
      /\bwindow\./,
      /\bdocument\./,
      /\blocalStorage\./,
      /\bsessionStorage\./,
      /\bnavigator\./,
      /\blocation\./,
      /\bhistory\./,
      /\baddEventListener\s*\(/,
      /\bremoveEventListener\s*\(/,
      /\bsetTimeout\s*\(/,
      /\bsetInterval\s*\(/,
      /\brequestAnimationFrame\s*\(/,
    ];

    // Only flag as client if browser APIs are used outside of useEffect/useLayoutEffect
    // (since server components can have browser API calls inside useEffect)
    const foundAPI = browserAPIs.find(api => api.test(content));
    if (foundAPI) {
      reasons.push(`uses browser API: ${foundAPI.source.match(/\\b(\w+)\./)?.[1] || 'detected'}`);
      if (CLIENT_DETECTION_CONFIG.verboseLogging) {
        console.log(`   [CLIENT] ${fileName} - ${reasons.join(', ')}`);
      }
      return true;
    }

    // 5. Default to false (server component)
    // Server components are the default in Next.js App Router
    if (CLIENT_DETECTION_CONFIG.verboseLogging) {
      console.log(`   [SERVER] ${fileName} - No client indicators found`);
    }
    return false;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    // Default to server component on error (safer default)
    return false;
  }
};

/**
 * Recursively find all component files in a directory
 * @param dirPath - Directory path to scan
 * @param componentFiles - Array to collect found files
 */
const findComponentFiles = (
  dirPath: string,
  componentFiles: Array<{ file: string; dir: string; isClient: boolean }> = []
): Array<{ file: string; dir: string; isClient: boolean }> => {
  if (!fs.existsSync(dirPath)) {
    return componentFiles;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    // Using statSync for more reliable file type detection
    const stats = fs.statSync(fullPath);

    // Skip node_modules, .git, and other hidden directories
    if (stats.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      // Recursively scan subdirectories
      findComponentFiles(fullPath, componentFiles);
    } else if (entry.isFile()) {
      // Check if it's a component file
      if (
        entry.name.endsWith('.tsx') ||
        entry.name.endsWith('.jsx') ||
        entry.name.endsWith('.ts') ||
        entry.name.endsWith('.js')
      ) {
        const isClient = isClientComponent(fullPath);
        componentFiles.push({
          file: entry.name,
          dir: dirPath,
          isClient,
        });
      }
    }
  }

  return componentFiles;
};

// Function to get all component files from the directories
export const generateRegisteredComponents = () => {
  try {
    // Ensure config directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Collect all component files from all directories (recursively)
    const serverComponentMap = new Map<string, { file: string; dir: string }>();
    const clientComponentMap = new Map<string, { file: string; dir: string }>();

    for (const dir of registeredComponentsDirs) {
      const files = findComponentFiles(dir);

      files.forEach(({ file, dir: fileDir, isClient }) => {
        const componentName = path.basename(file, path.extname(file));
        const componentData = { file, dir: fileDir };

        if (isClient) {
          // Add to client component map (first occurrence wins)
          if (!clientComponentMap.has(componentName)) {
            clientComponentMap.set(componentName, componentData);
          }
        } else {
          // Add to server component map (first occurrence wins)
          if (!serverComponentMap.has(componentName)) {
            serverComponentMap.set(componentName, componentData);
          }
        }
      });
    }

    // Generate server components registry
    generateRegistryFile(
      serverComponentMap,
      'registered-server-components.ts',
      'Server Components'
    );

    // Generate client components registry
    generateRegistryFile(
      clientComponentMap,
      'registered-client-components.ts',
      'Client Components'
    );

    console.log(`✅ Generated component registries:`);
    console.log(`   📦 Server: ${serverComponentMap.size} components`);
    console.log(`   🎨 Client: ${clientComponentMap.size} components`);

    return {
      server: Array.from(serverComponentMap.keys()),
      client: Array.from(clientComponentMap.keys()),
    };
  } catch (error) {
    console.error('Error reading registered components directories:', error);
    return { server: [], client: [] };
  }
};

/**
 * Generate a registry file for a component map
 */
const generateRegistryFile = (
  componentMap: Map<string, { file: string; dir: string }>,
  fileName: string,
  description: string
) => {
  // Generate import statements
  const imports = Array.from(componentMap.entries())
    .map(([componentName, { file, dir }]) => {
      const absPath = path.join(dir, file);
      const relImportPath = getRelativeImportPath(absPath).replace(/\.(tsx|jsx|js|ts)$/, '');
      return `import { ${componentName} } from '${relImportPath}';`;
    })
    .join('\n');

  // Import the ComponentMapper class
  const mapperImport = "import { componentMapperInstance } from '../utils/ComponentMapper';";

  const exportComponentTypes = componentMap.size > 0
    ? `export type ComponentTypes = ${Array.from(componentMap.keys())
      .map((componentName) => `'${componentName}'`)
      .join(' | ')};`
    : `export type ComponentTypes = never;`;

  // Generate component registration statements
  const componentRegistrations = Array.from(componentMap.keys())
    .map((componentName) => {
      return `componentMapperInstance.register('${componentName}', ${componentName});`;
    })
    .join('\n');

  // Generate export statements for a barrel file
  const exports = Array.from(componentMap.keys())
    .map((componentName) => {
      return `  ${componentName},`;
    })
    .join('\n');

  // Create a barrel file content with component map
  const barrelFileContent = `// Do not edit this file as it is an auto generated file
// If you need to update this file, please look into "/scripts/generate-component-mapper.ts"
// Registry Type: ${description}

${imports}
${mapperImport}

// Component names as a type
${exportComponentTypes}

// Register all components with the ComponentMapper
${componentRegistrations}

// Export the componentMapperInstance for use in the application
export const componentMapper = componentMapperInstance;

// Export all components individually
export {
${exports}
};
`;

  // Write the barrel file to the config directory
  fs.writeFileSync(path.join(configDir, fileName), barrelFileContent);
};

// Watch mode functionality
const startWatchMode = () => {
  // Initialize watcher for all directories (recursive watching)
  const watcher = chokidar.watch(registeredComponentsDirs, {
    ignored: /(^|[/\\])(\.|node_modules)/, // ignore dotfiles and node_modules
    persistent: true,
    ignoreInitial: false, // Run immediately on startup
    depth: 99, // Watch recursively to any depth
  });

  let isGenerating = false;

  // Debounce function to avoid running multiple times in quick succession
  const debounce = (func: () => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction() {
      const later = () => {
        clearTimeout(timeout);
        func();
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Debounced version of the generator
  const debouncedGenerate = debounce(() => {
    if (isGenerating) return;

    isGenerating = true;

    try {
      generateRegisteredComponents();
    } catch (error) {
      console.error('❌ Error updating component mapper:', error);
    } finally {
      isGenerating = false;
    }
  }, 100);

  // File system event handlers
  watcher
    .on('add', (filePath) => {
      const fileName = path.basename(filePath);
      if (fileName.match(/\.(tsx?|jsx?)$/)) {
        debouncedGenerate();
      }
    })
    .on('unlink', (filePath) => {
      const fileName = path.basename(filePath);
      if (fileName.match(/\.(tsx?|jsx?)$/)) {
        debouncedGenerate();
      }
    })
    .on('ready', () => { })
    .on('error', (error) => {
      console.error('❌ Watcher error:', error);
    });

  // Graceful shutdown
  process.on('SIGINT', () => {
    watcher.close().then(() => {
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    watcher.close().then(() => {
      process.exit(0);
    });
  });
};

// Main execution logic
const main = () => {
  const args = process.argv.slice(2);
  const isWatchMode = args.includes('--watch') || args.includes('-w');

  if (isWatchMode) {
    startWatchMode();
  } else {
    // Run once and exit
    generateRegisteredComponents();
  }
};

// Run the script if called directly
if (require.main === module) {
  main();
}