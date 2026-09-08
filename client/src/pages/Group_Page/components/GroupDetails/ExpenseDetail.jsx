import React, { useState } from "react";
import "./ExpenseDetail.css";
import ConfirmModal from "../../../../components/comman/ConfirmModel";

function ExpenseDetail({ expense, currentUser, onEdit, onDelete, viewOnly = false }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!expense || !currentUser) return null;

  const isPaidByMe =
    expense.paidBy?._id?.toString() === currentUser?._id?.toString();

  // ✅ creator check
  const isCreator =
    expense.createdBy?._id?.toString() === currentUser?.id?.toString();

  return (
    <div className="expense-detail">
      {/* HEADER */}
      <div className="expense-header">
        <h3 className="expense-title">{expense.title}</h3>
        <div className="expense-amount">₹{expense.amount}</div>
      </div>

      {/* PAID BY */}
      <div className="expense-row">
        <span className="label">Paid by</span>
        <span className="value">
          {isPaidByMe ? "You" : expense.paidBy?.name}
        </span>
      </div>

      {/* SPLIT DETAILS */}
      <div className="expense-split">
        <span className="label">Split details</span>

        {(expense.splits ?? []).length > 0 ? (
          (expense.splits ?? []).map((s, idx) => {
            const isMe =
              s.userId?._id?.toString() === currentUser?._id?.toString();

            return (
              <div key={idx} className="split-row">
                <span className="split-name">
                  {isMe ? "You" : s.userId?.name}
                </span>
                <span className="split-amount">₹{s.amount}</span>
              </div>
            );
          })
        ) : (
          <span className="split-name" style={{ opacity: 0.5 }}>
            Split details not available
          </span>
        )}
      </div>

      {/* NOTE */}
      {expense.note && (
        <div className="expense-note">
          <span className="label">Note</span>
          <p>{expense.note}</p>
        </div>
      )}

      {/* ACTIONS (ONLY FOR CREATOR, NOT IN VIEW-ONLY MODE) */}
      {!viewOnly && isCreator && (
        <div className="expense-actions">
          <button
            type="button"
            className="edit-action"
            onClick={() => onEdit?.(expense)}
          >
            Edit expense
          </button>

          <button
            type="button"
            className="delete-action"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete expense?"
        description="Are you sure you want to delete this expense?"
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete?.(expense);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}

export default ExpenseDetail;