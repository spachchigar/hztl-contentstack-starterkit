export function useFieldWithFallbacks(
  mainField: string | undefined,
  fallbackFields?: (string | undefined)[],
  hasValue: (field: string | undefined) => boolean = (x) => !!x
) {
  // We want to know the fallback field regardless if there is a valid one
  let fallbackFieldForEditing;

  // Loop through fallback fields to find one that has a value
  for (let i = 0; i < (fallbackFields?.length ?? 0); i++) {
    const field = fallbackFields?.[i];
    if (hasValue(field)) {
      fallbackFieldForEditing = field;
      break;
    }
  }

  let renderField;

  if (hasValue(mainField)) {
    renderField = mainField;
  } else {
    renderField = fallbackFieldForEditing ?? mainField;
  }

  return {
    renderField,
    fallbackFieldForEditing,
  };
}
