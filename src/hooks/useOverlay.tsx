import React, { type ReactNode, type ReactPortal, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface UseOverlayOptions {
  title?: string;
  className?: string;
  closable?: boolean;
  closeOnEscape?: boolean;
  closeOnEnter?: boolean;
  closeOnBackdrop?: boolean;
  initialOpen?: boolean;
}

export interface OverlayControls {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  render: (content: ReactNode) => ReactPortal | null;
}

export const useOverlay = (options: UseOverlayOptions = {}): OverlayControls => {
  const {
    title,
    className = "",
    closable = true,
    closeOnEscape = true,
    closeOnEnter = true,
    closeOnBackdrop = true,
    initialOpen = false,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (initialOpen) {
      setIsOpen(true);
    }
  }, [initialOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || !closable) return;

      if ((event.key === "Escape" && closeOnEscape) || (event.key === "Enter" && closeOnEnter)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, close, closable, closeOnEscape, closeOnEnter]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnBackdrop && closable && e.target === e.currentTarget) {
        close();
      }
    },
    [close, closable, closeOnBackdrop],
  );

  const render = useCallback(
    (content: ReactNode) => {
      if (!isMounted || !isOpen || typeof document === "undefined") return null;

      const modalElement = (
        <div
          className={`fixed inset-0 flex items-center justify-center transition-opacity duration-200 ease-out ${className}`}
          onClick={handleBackdropClick}
          style={{
            zIndex: 99999,
            animation: "fadeIn 0.2s ease-out",
            backgroundColor: "rgba(75, 85, 99, 0.2)",
          }}
        >
          <style>
            {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes slideIn {
              from { 
                opacity: 0; 
                transform: scale(0.95) translateY(-10px); 
              }
              to { 
                opacity: 1; 
                transform: scale(1) translateY(0); 
              }
            }
            
            .overlay-content {
              animation: slideIn 0.2s ease-out;
            }
          `}
          </style>

          <div className="overlay-content border-opacity-10 max-h-[80vh] w-11/12 max-w-lg overflow-auto rounded-xl border border-white bg-white p-6 shadow-2xl">
            {title && (
              <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex-1"></div>
                <h2 className="m-0 text-center text-2xl font-semibold text-gray-800">{title}</h2>
                <div className="flex flex-1 justify-end">
                  {closable && (
                    <button
                      onClick={close}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-2 text-lg leading-none text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-red-50 hover:text-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="leading-relaxed">{content}</div>
          </div>
        </div>
      );

      return createPortal(modalElement, document.body) as ReactPortal;
    },
    [isMounted, isOpen, className, handleBackdropClick, title, closable, close],
  );

  return {
    isOpen,
    open,
    close,
    toggle,
    render,
  };
};
