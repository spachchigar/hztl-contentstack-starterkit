import { componentMapperInstance } from '@/utils/ComponentMapper';
import { toPascalCase } from '@/utils/string-utils';
import { ISystemFields } from '@/.generated';
import { IExtendedProps } from '@/lib/types';

// type EntriesDataType = Array<{
//   componentName: string;
//   componentId: string;
//   data: Record<string, unknown>;
// }>;

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
  // let entriesData: EntriesDataType | undefined = [];
  // try {
  //   // Group references by content type
  //   const referencesByContentType = references.reduce((acc, ref) => {
  //     if (!ref._content_type_uid || !ref.uid) return acc;

  //     const contentType = ref._content_type_uid;

  //     if (!acc[contentType]) {
  //       acc[contentType] = [];
  //     }

  //     acc[contentType].push(ref.uid);

  //     return acc;
  //   }, {} as Record<string, string[]>);

  //   // Create an array of promises for each content type
  //   const entryPromises = Object.entries(referencesByContentType).map(
  //     async ([contentTypeUid, uids]) => {
  //       const response = await getEntriesByUids({
  //         contentTypeUid,
  //         entryUids: uids, // Pass array of UIDs
  //         referencesToInclude,
  //       });

  //       // If no entries found, return empty array
  //       if (!response) return [];

  //       // Map each entry to the required format
  //       return (response.entries as Record<string, unknown>[])?.map((entryData) => ({
  //         componentName: toPascalCase(contentTypeUid),
  //         componentId: contentTypeUid,
  //         data: entryData,
  //       }));
  //     }
  //   );

  //   // Wait for all promises and flatten the results
  //   const results = await Promise.all(entryPromises);
  //   const flatResults = results.flat();

  //   // Create a lookup map by UID to preserve original order
  //   const entryMap = new Map<string, (typeof flatResults)[0]>();
  //   flatResults.forEach((entry) => {
  //     const uid = (entry.data as { uid?: string })?.uid;
  //     if (uid) {
  //       entryMap.set(uid, entry);
  //     }
  //   });

  //   // Restore original order by mapping through the original references array
  //   entriesData = references
  //     .map((ref) => (ref.uid ? entryMap.get(ref.uid) : undefined))
  //     .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined);
  // } catch (err) {
  //   console.error('Error fetching entry data:', err);
  // }

  return references?.map((componentItem, index) => {
    // Return if componentItem is undefined
    if (!componentItem) return <></>;

    const Component = componentMapperInstance.getComponent(
      componentName || toPascalCase(componentItem?._content_type_uid || '')
    );

    // if (!Component) return <NotFound key={index} componentName={componentItem?.componentName} />;
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
