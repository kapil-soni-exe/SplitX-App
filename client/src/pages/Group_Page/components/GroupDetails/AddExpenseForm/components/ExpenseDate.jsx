import React from "react";

/**
 * ExpenseDate
 * Handles expense date selection with matching form-field structure for perfect alignment with PaidBySelect.
 */
function ExpenseDate({ date, setFormInput }) {
  return (
    <div className="form-field">
      <label htmlFor="expense-date">Date</label>
      <input
        id="expense-date"
        type="date"
        className="form-dropdown"
        value={date}
        onChange={(e) =>
          setFormInput((prev) => ({
            ...prev,
            createdAt: e.target.value,
          }))
        }
      />
    </div>
  );
}

export default ExpenseDate;