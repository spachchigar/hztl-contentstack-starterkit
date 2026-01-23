/**
 * Initialize component registry by importing registered-components
 * This ensures all components are registered before any component tries to use componentMapperInstance
 *
 * Import this file in the root client component (providers/index.tsx) to ensure
 * registration happens early and avoids circular dependencies
 */
import '@/temp/registered-components';

// Re-export for convenience if needed
// export { componentMapperInstance } from './ComponentMapper';
