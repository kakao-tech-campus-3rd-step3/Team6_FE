import React, { type ReactNode, type ReactPortal, useCallback, useEffect, useRef, useState } from "react";
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
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

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
        return;
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements?.[0] as HTMLElement;
        firstElement?.focus();
      }, 100);
    } else {
      previousFocusRef.current?.focus();
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
        <>
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: "0",
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: "0",
            }}
          >
            {isOpen && title ? `${title} 대화상자가 열렸습니다` : ""}
          </div>

          <div
            className={`fixed inset-0 flex items-center justify-center transition-opacity duration-200 ease-out ${className}`}
            onClick={handleBackdropClick}
            role="presentation"
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

            <div
              ref={modalRef}
              className="overlay-content border-opacity-10 max-h-[80vh] w-11/12 max-w-lg overflow-auto rounded-xl border border-white bg-white p-6 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? "modal-title" : undefined}
            >
              {title && (
                <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex-1"></div>
                  <h2 id="modal-title" className="m-0 text-center text-2xl font-semibold text-gray-800">
                    {title}
                  </h2>
                  <div className="flex flex-1 justify-end">
                    {closable && (
                      <button
                        onClick={close}
                        aria-label="닫기"
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
        </>
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
