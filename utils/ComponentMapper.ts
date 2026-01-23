import { toPascalCase } from './string-utils';
import { NotFound } from '../components/primitives/NotFound';

/**
 * Class responsible for registering and retrieving components
 */
export class ComponentMapper {
  private static instance: ComponentMapper;
  private components: Record<string, React.ComponentType<any>> = {};
  private notFoundComponent: React.ComponentType<any> = NotFound;

  private constructor() { }

  static getInstance(): ComponentMapper {
    if (!ComponentMapper.instance) {
      ComponentMapper.instance = new ComponentMapper();
    }
    return ComponentMapper.instance;
  }

  /**
   * Register a single component
   * @param name The component name (will be converted to PascalCase)
   * @param component The React component
   */
  register(name: string, component: any): void {
    this.components[toPascalCase(name)] = component;
  }

  /**
   * Register multiple components at once
   * @param components Object mapping component names to component implementations
   */
  registerBulk(components: Record<string, React.ComponentType<any>>): void {
    Object.entries(components).forEach(([name, component]) => {
      this.register(name, component);
    });
  }

  /**
   * Get a component by name
   * @param name The component name (will be converted to PascalCase)
   * @param returnNotFound Whether to return the NotFound component if the component is not found
   * @returns The component, NotFound component, or undefined based on returnNotFound parameter
   */
  getComponent(name: string): React.ComponentType<any> {
    const component = this.components[toPascalCase(name)];

    if (!component) {
      // Return a wrapped NotFound component that will receive the correct props
      return this.notFoundComponent;
    }

    return component;
  }

  /**
   * Check if a component exists
   * @param name The component name (will be converted to PascalCase)
   * @returns True if the component exists
   */
  hasComponent(name: string): boolean {
    return !!this.components[toPascalCase(name)];
  }

  /**
   * Get all registered components
   * @returns Record of all registered components
   */
  getAllComponents(): Record<string, React.ComponentType<any>> {
    return { ...this.components };
  }
}

// Create and export a singleton instance
export const componentMapperInstance = ComponentMapper.getInstance();
