type CreateItemFunction<ItemType> = () => ItemType;

type CustomFieldSetter<ItemType> = (
  items: ItemType[],
  setValue: (field: string, value: any) => void
) => void;

export function handleDynamicArrayCountChange<T, ItemType>({
  value,
  watch,
  setValue,
  getValues,
  fieldName,
  createNewItem,
  saveCallback,
  customFieldSetters = {},
  isDataFilled = (item: ItemType) => !!item,
  onRequireConfirmation,
}: {
  value: string;
  watch: (field: string) => ItemType[];
  setValue: (field: string, value: any) => void;
  getValues: () => T;
  fieldName: string;
  createNewItem: CreateItemFunction<ItemType>;
  saveCallback?: (data: T) => void;
  customFieldSetters?: Record<string, CustomFieldSetter<ItemType>>;
  isDataFilled?: (item: ItemType) => boolean;
  onRequireConfirmation?: (pendingItemsToRemove: ItemType[], confirmedCallback: () => void) => void;
}) {
  const count = Math.max(1, Math.min(parseInt(value, 10) || 1, 50));
  const currentItems = watch(fieldName) || [];

  if (count < currentItems.length) {
    const removedItems = currentItems.slice(count);
    const hasFilledData = removedItems.some(isDataFilled);

    if (hasFilledData && onRequireConfirmation) {
      onRequireConfirmation(removedItems, () => {
        applyNewItemList();
      });
      return;
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