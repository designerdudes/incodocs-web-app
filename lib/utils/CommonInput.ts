type CreateItemFunction<T> = () => T;

type CustomFieldSetter<T> = (items: T[], setValue: (field: string, value: any) => void) => void;

export function handleDynamicArrayCountChange<T>({
  value,
  watch,
  setValue,
  getValues,
  fieldName,
  createNewItem,
  saveCallback,
  customFieldSetters = {},
  confirmCallback = (message: string) => window.confirm(message), // default browser confirm
  isDataFilled = (item: T) => !!item, // customize based on your item structure
}: {
  value: string;
  watch: (field: string) => T[];
  setValue: (field: string, value: any) => void;
  getValues: () => any;
  fieldName: string;
  createNewItem: CreateItemFunction<T>;
  saveCallback?: (data: any) => void;
  customFieldSetters?: Record<string, CustomFieldSetter<T>>;
  confirmCallback?: (message: string) => boolean;
  isDataFilled?: (item: T) => boolean;
}) {
  let count = Math.max(1, Math.min(parseInt(value, 10) || 1, 50)); // min 1, max 50
  const currentItems = watch(fieldName) || [];

  if (count < currentItems.length) {
    const removedItems = currentItems.slice(count);
    const hasFilledData = removedItems.some(isDataFilled);

    if (hasFilledData) {
      const confirmed = confirmCallback(
        `You are about to remove ${removedItems.length} item(s) with data. Are you sure?`
      );
      if (!confirmed) return;
    }
  }

  const newItems = Array.from({ length: count }, (_, i) => currentItems[i] || createNewItem());
  setValue(fieldName, newItems);

  if (customFieldSetters[fieldName]) {
    customFieldSetters[fieldName](newItems, setValue);
  }

  if (saveCallback) {
    saveCallback(getValues());
  }
}
