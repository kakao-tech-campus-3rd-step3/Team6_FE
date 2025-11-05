import { useCallback, useState } from "react";

export interface UseOverlayOptions {
  initialOpen?: boolean;
}

export const useOverlay = (options: UseOverlayOptions = {}) => {
  const { initialOpen = false } = options;
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};
