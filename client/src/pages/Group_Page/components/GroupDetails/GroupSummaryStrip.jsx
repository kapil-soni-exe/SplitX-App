import React from "react";
import "./GroupSummaryStrip.css";

function GroupSummaryStrip({ myExpense = 0, totalExpense = 0 }) {
  return (
    <div className="group-summary-strip">
      <div className="summary-item">
        <span className="summary-label">My Expense</span>
        <span className="summary-value">₹{myExpense}</span>
      </div>

      <div className="summary-divider" />

      <div className="summary-item">
        <span className="summary-label">Total Expense</span>
        <span className="summary-value">₹{totalExpense}</span>
      </div>
    </div>
  );
}

export default GroupSummaryStrip;