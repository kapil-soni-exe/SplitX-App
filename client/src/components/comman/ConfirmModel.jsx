/**
 * ConfirmModal
 * ------------
 * Generic confirmation modal
 *
 * Usage:
 * - delete
 * - leave
 * - reset
 * - discard
 */

import Model from "./Model";
import "./ConfirmModel.css";

function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) {
  return (
    <Model isOpen={isOpen} onClose={onCancel}>
      <div className="confirm-modal">
        <h3>{title}</h3>

        {description && <p>{description}</p>}

        <div className="confirm-actions">
          <button className="confirm-btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>

          <button
            className={`confirm-btn-primary ${confirmVariant}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Model>
  );
}

export default ConfirmModal;