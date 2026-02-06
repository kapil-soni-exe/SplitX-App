import React, { useState } from "react";
import "./AddExpenseForm.css";
import Input from "../../../../components/comman/Input";
import Button from "../../../../components/comman/Button";
function AddExpenseForm({ members, groupId, onAddExpense }) {
  const [formInput, setformInput] = useState({
    title: "",
    amount: " ",
    paidBy: " ",
    splitBetween: [],
    createdAt: " ",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // simple validation
    if (
      !formInput.title.trim() ||
      !formInput.amount ||
      !formInput.paidBy ||
      formInput.splitBetween.length === 0 ||
      !formInput.createdAt
    ) {
      alert("Fill all fields");
      return;
    }
    const expensePayload = {
      title: formInput.title.trim(),
      amount: Number(formInput.amount),
      paidBy: formInput.paidBy,
      splitBetween: formInput.splitBetween,
      createdAt: formInput.createdAt,
      groupId,
    };

    onAddExpense?.(expensePayload);

    // reset form
    setformInput({
      title: "",
      amount: "",
      paidBy: "",
      splitBetween: [],
      createdAt: "",
    });
  };
  return (
    <form className="add-expense-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Add Expense</h3>

      {/* Title + Amount Row */}
      <div className="form-row">
        <div className="form-field">
          <Input
            label="Title"
            placeholder="Enter Your Title"
            type="text"
            id="title"
            value={formInput.title}
            onChange={(e) =>
              setformInput((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />
        </div>

        <div className="form-field">
          <Input
            type="number"
            label="Amount"
            placeholder="Amount"
            id="amount"
            value={formInput.amount}
            onChange={(e) =>
              setformInput((prev) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {/* Paid By */}
      <div className="form-field">
        <label htmlFor="dropdown">Paid By</label>
        <select
          className="form-dropdown"
          id="dropdown"
          value={formInput.paidBy}
          onChange={(e) =>
            setformInput((prev) => ({
              ...prev,
              paidBy: e.target.value,
            }))
          }
        >
          <option value="">Select user</option>
          {members.map((item) => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Split Between */}
      <div className="split-section">
        <div className="split-header">
          <p>Split Between</p>
        </div>

        <div className="split-list">
          {members.map((member) => (
            <label key={member.id} className="split-checkbox">
              <input
                type="checkbox"
                value={member.id}
                checked={formInput.splitBetween.includes(member.id)}
                onChange={(e) => {
                  const id = e.target.value;

                  setformInput((prev) => {
                    const updatedSplit = e.target.checked
                      ? [...prev.splitBetween, id]
                      : prev.splitBetween.filter((uid) => uid !== id);

                    return {
                      ...prev,
                      splitBetween: updatedSplit,
                    };
                  });
                }}
              />

              {member.name}
            </label>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="form-field">
        <Input
          label="Date"
          type="date"
          id="date"
          value={formInput.createdAt}
          onChange={(e) =>
            setformInput((prev) => ({
              ...prev,
              createdAt: e.target.value,
            }))
          }
        />
      </div>

      {/* Submit */}
      <div className="form-action-btn">
        <Button type="submit" text="Submit" variant="primary" />
      </div>
    </form>
  );
}

export default AddExpenseForm;
