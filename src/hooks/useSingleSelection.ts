import { useState } from "react";

export const useSingleSelection = <T extends string>(initialSelection?: T) => {
  const [selection, setSelection] = useState<T | undefined>(initialSelection);

  const selectItem = (item: T) => {
    setSelection(item);
  };

  const isSelected = (item: T) => selection === item;

  const clearSelection = () => setSelection(undefined);

  return {
    selection,
    selectItem,
    isSelected,
    clearSelection,
  };
};
