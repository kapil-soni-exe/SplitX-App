/**
 * ExpenseChatList
 * ----------------
 * Presentational component for rendering
 * timeline events in chat-style UI.
 *
 * Supported event types:
 * - EXPENSE
 * - DELETE
 * - JOIN (system event)
 *
 * Responsibilities:
 * - Sort events by date
 * - Group events by day label
 * - Render incoming / outgoing messages
 * - Render system pills (join etc.)
 *
 * NOTE:
 * - No API calls
 * - No local state
 */

import React from "react";
import {
  getDayLabel,
  sortByDate,
  formatTime,
} from "../../utils/dateHelper";

import { activityFormatter } from "../../utils/activityFormatter";

function ExpenseChatList({ expenses, user, onSelectExpense }) {

  // Sort all timeline events (expenses + joins)
  const sortedExpenses = sortByDate(expenses);

  // Used for grouping messages by day
  let lastLabel = null;

  const userId = user?._id || user?.id;

  return (
    <>

      {sortedExpenses.map((expense) => {

        const label = getDayLabel(expense.createdAt);

        // Show date separator when day changes
        const showLabel = label !== lastLabel;
        lastLabel = label;

        /* =========================
           JOIN EVENT (SYSTEM PILL)
        ========================== */

        if (expense.type === "JOIN") {
          return (
            <React.Fragment key={expense._id}>

              {showLabel && (
                <div className="chat-date-separator">
                  {label}
                </div>
              )}

              <div className="chat-system-pill">
                {expense.user.name} joined the group
              </div>

            </React.Fragment>
          );
        }

        /* =========================
   LEAVE EVENT (SYSTEM PILL)
========================= */

if (expense.type === "LEAVE") {
  return (
    <React.Fragment key={expense._id}>

      {showLabel && (
        <div className="chat-date-separator">
          {label}
        </div>
      )}

      <div className="chat-system-pill">
        {expense.user.name} left the group
      </div>

    </React.Fragment>
  );
}

        /* =========================
           NORMAL EXPENSE EVENTS
        ========================== */

        const isDeleted = Boolean(expense.deletedAt);

        // Determine who performed the action
        const actorId = isDeleted
          ? expense.deletedBy?._id || expense.deletedBy
          : expense.createdBy?._id || expense.createdBy;

        // Decide outgoing vs incoming bubble
        const isOutgoing =
          actorId?.toString() === userId?.toString();

        return (
          <React.Fragment key={expense._id}>

            {showLabel && (
              <div className="chat-date-separator">
                {label}
              </div>
            )}

            {/* ================= DELETED EXPENSE ================= */}

            {isDeleted ? (
              <div
                className={`chat-message deleted ${
                  isOutgoing ? "outgoing" : "incoming"
                }`}
              >
                <p className="deleted-text">
                  {expense.deletedBy?._id === user?.id
                    ? "You deleted an expense"
                    : `${expense.deletedBy?.name} deleted an expense`}
                </p>

                <span className="chat-time">
                  {formatTime(expense.updatedAt)}
                </span>
              </div>
            ) : (

              /* ================= NORMAL EXPENSE ================= */

              <div
                className={`chat-message ${
                  isOutgoing ? "outgoing" : "incoming"
                }`}
                onClick={() => onSelectExpense(expense)}
              >

                {/* Main activity message */}
                <p>
                  {activityFormatter(expense, userId)}
                </p>

                {/* Show who actually paid */}
                {expense.paidBy && (
                  <p className="chat-paidby">
                    Paid by{" "}
                    {expense.paidBy._id?.toString() === userId?.toString()
                      ? "You"
                      : expense.paidBy.name}
                  </p>
                )}

                {/* Optional note */}
                {expense.note && (
                  <p className="chat-note">
                    {expense.note}
                  </p>
                )}

                {/* Time + edited indicator */}
                <span className="chat-time">
                  {formatTime(expense.createdAt)}

                  {expense.editedAt && (
                    <span className="chat-edited">
                      {" "}· Edited
                    </span>
                  )}
                </span>

              </div>
            )}

          </React.Fragment>
        );
      })}
    </>
  );
}

export default ExpenseChatList;