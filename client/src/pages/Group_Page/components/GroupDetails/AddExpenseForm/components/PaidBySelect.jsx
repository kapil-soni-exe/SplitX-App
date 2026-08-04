import React from "react";

/**
 * PaidBySelect
 * -----------------
 * Handles selection of the user who paid the expense
 */
function PaidBySelect({ members = [], paidBy, setFormInput }) {
  return (
    <div className="form-field">
      <label htmlFor="expense-paid-by">Paid By</label>

      <select
        id="expense-paid-by"
        className="form-dropdown"
        value={paidBy}
        onChange={(e) =>
          setFormInput((prev) => ({
            ...prev,
            paidBy: e.target.value,
          }))
        }
      >
        <option value="">Select user</option>

        {members.map((member) => {
          const user = member.userId;
          if (!user) return null;

          return (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default PaidBySelect;