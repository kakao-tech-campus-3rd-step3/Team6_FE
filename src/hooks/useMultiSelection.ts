export const useMultiSelection = <T extends string>(selections: T[], onSelectionChange: (selections: T[]) => void) => {
  const toggleSelection = (item: T) => {
    const isSelected = selections.includes(item);
    if (isSelected) {
      onSelectionChange(selections.filter((selected) => selected !== item));
    } else {
      onSelectionChange([...selections, item]);
    }
  };

  const isSelected = (item: T) => selections.includes(item);

  const clearSelections = () => onSelectionChange([]);

  return {
    selections,
    toggleSelection,
    isSelected,
    clearSelections,
  };
};
