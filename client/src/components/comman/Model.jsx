import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { RiCloseCircleLine } from "@remixicon/react";
import "./Model.css";

// Module-level reference-counting for body scroll lock
let openModalCount = 0;

function Modal({ isOpen, onClose, children, variant = "center" }) {
  const modalRef = useRef(null);

  // Safe reference-counted body scroll lock
  useEffect(() => {
    if (isOpen) {
      openModalCount++;
      document.body.style.overflow = "hidden";
    }

    return () => {
      if (isOpen) {
        openModalCount--;
        if (openModalCount <= 0) {
          document.body.style.overflow = "auto";
          openModalCount = 0;
        }
      }
    };
  }, [isOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Initial focus management on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      {variant === "center" && (
        <div
          ref={modalRef}
          tabIndex={-1}
          className="modal-box"
          role="dialog"
          aria-modal="true"
          aria-label="Dialog"
          onClick={(e) => e.stopPropagation()}
        >
          <RiCloseCircleLine
            tabIndex={0}
            role="button"
            aria-label="Close dialog"
            className="close-btn"
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClose();
              }
            }}
          />
          {children}
        </div>
      )}

      {variant === "drawer" && (
        <div
          ref={modalRef}
          tabIndex={-1}
          className="modal-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Dialog"
          onClick={(e) => e.stopPropagation()}
        >
          <RiCloseCircleLine
            tabIndex={0}
            role="button"
            aria-label="Close dialog"
            className="close-btn"
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClose();
              }
            }}
          />
          {children}
        </div>
      )}
    </div>,
    document.body
  );
}

export default Modal;