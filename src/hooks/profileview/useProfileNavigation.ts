import type { UseProfileNavigationOptions } from "@/hooks/profileview";
import { useState } from "react";

export const useProfileNavigation = ({ totalCount, onComplete }: UseProfileNavigationOptions) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalCount) {
      onComplete?.();
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const canGoNext = currentIndex < totalCount - 1;
  const canGoPrev = currentIndex > 0;
  const isLast = currentIndex === totalCount - 1;

  return {
    currentIndex,
    handleNext,
    handlePrev,
    canGoNext,
    canGoPrev,
    isLast,
  };
};
