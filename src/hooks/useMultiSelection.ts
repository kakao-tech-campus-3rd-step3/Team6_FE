import { useState } from "react";

export const useMultiSelection = <T extends string>(initialSelection: T[] = []) => {
  const [selections, setSelections] = useState<T[]>(initialSelection);

  const toggleSelection = (item: T) => {
    setSelections((prev) => (prev.includes(item) ? prev.filter((selected) => selected !== item) : [...prev, item]));
  };

  const isSelected = (item: T) => selections.includes(item);

  const clearSelections = () => setSelections([]);

  return {
    selections,
    toggleSelection,
    isSelected,
    clearSelections,
  };
};
