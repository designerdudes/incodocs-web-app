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
  isDataFilled = (item: T) => !!item,
  onRequireConfirmation,
}: {
  value: string;
  watch: (field: string) => T[];
  setValue: (field: string, value: any) => void;
  getValues: () => any;
  fieldName: string;
  createNewItem: CreateItemFunction<T>;
  saveCallback?: (data: any) => void;
  customFieldSetters?: Record<string, CustomFieldSetter<T>>;
  isDataFilled?: (item: T) => boolean;
  onRequireConfirmation?: (pendingItemsToRemove: T[], confirmedCallback: () => void) => void;
}) {
  const count = Math.max(1, Math.min(parseInt(value, 10) || 1, 50));
  const currentItems = watch(fieldName) || [];

  if (count < currentItems.length) {
    const removedItems = currentItems.slice(count);
    const hasFilledData = removedItems.some(isDataFilled);

    if (hasFilledData) {
      if (onRequireConfirmation) {
        // Let the component show a confirmation modal
        onRequireConfirmation(removedItems, () => {
          applyNewItemList();
        });
        return;
      }
    }
  }

  applyNewItemList();

  function applyNewItemList() {
    const newItems = Array.from({ length: count }, (_, i) => currentItems[i] || createNewItem());
    setValue(fieldName, newItems);

    if (customFieldSetters[fieldName]) {
      customFieldSetters[fieldName](newItems, setValue);
    }

    if (saveCallback) {
      saveCallback(getValues());
    }
  }
}
