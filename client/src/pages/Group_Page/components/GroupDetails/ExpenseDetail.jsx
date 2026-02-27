import React from "react";
import "./ExpenseDetail.css";

function ExpenseDetail({ expense, currentUser, onEdit, onDelete }) {
  if (!expense || !currentUser) return null;

  const isPaidByMe =
    expense.paidBy?._id?.toString() === currentUser?._id?.toString();

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

        {expense.splits.map((s, idx) => {
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
        })}
      </div>

      {/* NOTE */}
      {expense.note && (
        <div className="expense-note">
          <span className="label">Note</span>
          <p>{expense.note}</p>
        </div>
      )}

      {/* ACTIONS */}
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
          onClick={() => onDelete?.(expense)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ExpenseDetail;