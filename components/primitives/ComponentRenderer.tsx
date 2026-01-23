/* eslint-disable @typescript-eslint/no-explicit-any */
import { IExtendedProps } from '@/lib/types';
import { componentMapperInstance } from '@/utils/ComponentMapper';
import { toPascalCase } from '@/utils/string-utils';

interface DynamicComponentRendererProps extends IExtendedProps {
  components?: Array<Record<string, any>>;
}

export const ComponentRenderer = ({ components, extendedProps }: DynamicComponentRendererProps) => {
  return components?.map((component, index) => {
    const componentName = Object.keys(component)?.[0];
    try {
      // Use the getComponent method with returnNotFound=true to automatically handle missing components
      const Component = componentMapperInstance.getComponent(componentName);

      return (
        <Component
          key={index}
          componentName={toPascalCase(componentName)}
          extendedProps={extendedProps}
          {...(component as Record<string, object>)[componentName]}
        />
      );
    } catch (error) {
      console.error(`Error rendering component "${componentName}":`, error);
      return null;
    }
  });
};
