export type FieldLikeObject = { value?: unknown; href?: string };
export interface FieldWithFallback<T extends FieldLikeObject> {
  /**
   * The field to render.  When editing, this will always be the main field.
   */
  renderField?: T;
  /** For use in editing mode when we want to render the main field, but have help text
   * showing the fallback field */
  fallbackFieldForEditing?: T;
}
export function useContentWithFallbacks(
  mainContent: string | undefined,
  fallbackContents?: (string | undefined)[],
  hasValue: (content: string | undefined) => boolean = (x) => !!x
) {
  if (hasValue(mainContent)) {
    return mainContent;
  } else {
    return fallbackContents?.[0];
  }
}
