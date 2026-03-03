import { useEffect } from "react";
import { createPortal } from "react-dom";
import { RiCloseCircleLine } from "@remixicon/react";
import "./Model.css";

function Modal({ isOpen, onClose, children, variant = "center" }) {
  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      {variant === "center" && (
        <div
          className="modal-box"
          onClick={(e) => e.stopPropagation()}
        >
          <RiCloseCircleLine
            className="close-btn"
            onClick={onClose}
          />
          {children}
        </div>
      )}

      {variant === "drawer" && (
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>,
    document.body
  );
}

export default Modal;