import React, { type ReactNode, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  closable?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  children: ReactNode;
}

const DELAY = 100;

export const Overlay = ({
  isOpen,
  onClose,
  title,
  className = "",
  closable = true,
  closeOnEscape = true,
  closeOnBackdrop = true,
  children,
}: OverlayProps) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousOverflowRef = useRef<string>("");
  const focusTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closable && closeOnEscape) {
        onClose();
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const count = focusableElements.length;

        if (count === 0) {
          event.preventDefault();
          modalRef.current.focus();
          return;
        }

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
      previousOverflowRef.current = document.body.style.overflow;
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      focusTimeoutRef.current = window.setTimeout(() => {
        const firstElement = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )?.[0] as HTMLElement;
        if (firstElement) {
          firstElement.focus();
        } else {
          modalRef.current?.focus();
        }
      }, DELAY);
    } else {
      previousFocusRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflowRef.current;
      if (focusTimeoutRef.current !== null) {
        clearTimeout(focusTimeoutRef.current);
        focusTimeoutRef.current = null;
      }
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose, closable, closeOnEscape]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnBackdrop && closable && e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose, closable, closeOnBackdrop],
  );

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const modalElement = (
    <>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isOpen && title ? `${title} 대화상자가 열렸습니다` : ""}
      </div>

      <div
        className={`fixed inset-0 z-[99999] flex items-center justify-center bg-gray-500/20 transition-opacity duration-200 ease-out ${className}`}
        onClick={handleBackdropClick}
        role="presentation"
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideIn { from { opacity: 0; transform: scale(0.95) translateY(-10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
          .overlay-content { animation: slideIn 0.2s ease-out; }
        `}</style>

        <div
          ref={modalRef}
          className="overlay-content max-h-[80vh] w-11/12 max-w-lg overflow-auto rounded-xl border border-white/10 bg-white p-6 shadow-2xl"
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
                    onClick={onClose}
                    aria-label="닫기"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-2 text-lg leading-none text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-red-50 hover:text-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="leading-relaxed">{children}</div>
        </div>
      </div>
    </>
  );

  return createPortal(modalElement, document.body);
};
