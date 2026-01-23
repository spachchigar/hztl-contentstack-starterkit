import { componentMapperInstance } from '@/utils/ComponentMapper';
import { toPascalCase } from '@/utils/string-utils';
import { ISystemFields } from '@/.generated';
import { IExtendedProps } from '@/lib/types';
import { NotFound } from './NotFound';

type ComponentTypes = string;

export const ReferencePlaceholder = ({
  references = [],
  componentName,
  extendedProps,
}: {
  references: Array<ISystemFields>;
  referencesToInclude?: string | Array<string>;
  componentName?: ComponentTypes;
} & IExtendedProps) => {
  return references?.map((componentItem, index) => {
    // Return if componentItem is undefined
    if (!componentItem) return <></>;

    const Component = componentMapperInstance.getComponent(
      componentName || toPascalCase(componentItem?._content_type_uid || '')
    );

    if (!Component) return <NotFound key={index} componentName={componentItem?._content_type_uid || ''} />;
    return (
      <Component
        key={index}
        componentName={toPascalCase(componentItem._content_type_uid || '')}
        componentUid={componentItem.uid}
        extendedProps={extendedProps}
        {...componentItem}
      />
    );
  });
};
