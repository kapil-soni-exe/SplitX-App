import { useState } from "react";

/**
 * useExpenseForm
 * Centralizes expense form logic.
 * UI and backend share the same splitType values:
 * - EQUAL
 * - EXACT
 */
export function useExpenseForm({ groupId, onAddExpense }) {
  const initialState = {
    title: "",
    amount: "",
    paidBy: "",
    splitBetween: [],
    splits: {}, // used only for EXACT
    createdAt: "",
    splitType: "EQUAL", // EQUAL | EXACT
    description: "",
  };

  const [formInput, setFormInput] = useState(initialState);

  const LARGE_AMOUNT_THRESHOLD = 10000; 

  const resetForm = () => setFormInput(initialState);


  const isSuspiciousAmount =
  Number(formInput.amount) >= LARGE_AMOUNT_THRESHOLD;

  // Disable submit button when invalid
  const isSubmitDisabled =
    !formInput.title.trim() ||
    !formInput.amount ||
    !formInput.paidBy ||
    formInput.splitBetween.length < 2 ||
    !formInput.createdAt;


    const submitErrorReason = (() => {
  if (!formInput.title.trim()) return "Enter expense title";
  if (!formInput.amount) return "Enter amount";
  if (!formInput.paidBy) return "Select who paid";
  if (formInput.splitBetween.length < 2)
    return "Select at least 2 members";
  if (!formInput.createdAt) return "Select date";
  return null;
})();

 const handleSubmit = (e) => {
  e.preventDefault();

  if (isSubmitDisabled) {
    alert("Please select at least 2 members and fill all required fields");
    return;
  }

  const numericAmount = Number(formInput.amount);
  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    alert("Enter a valid amount");
    return;
  }

  // ⚠️ Large amount confirmation
  if (isSuspiciousAmount) {
    const confirmed = window.confirm(
      `Amount ₹${numericAmount} looks unusually high.\n\nPlease double-check.\nDo you want to continue?`
    );
    if (!confirmed) return;
  }

  if (formInput.splitType === "EXACT") {
    const hasAnySplitValue = Object.keys(formInput.splits).length > 0;

    if (hasAnySplitValue) {
      for (const id of formInput.splitBetween) {
        if (formInput.splits[id] === undefined || formInput.splits[id] === "") {
          alert("Enter amount for all selected members");
          return;
        }
      }

      const total = Object.values(formInput.splits).reduce(
        (sum, v) => sum + Number(v),
        0
      );

      if (Number(total.toFixed(2)) !== numericAmount) {
        alert("Split total must equal expense amount");
        return;
      }
    }

    if (!formInput.splitBetween.includes(formInput.paidBy)) {
      alert("Paid by user must be included in split");
      return;
    }

    onAddExpense({
      groupId,
      title: formInput.title.trim(),
      note: formInput.description.trim(),
      amount: numericAmount,
      paidBy: formInput.paidBy,
      splitType: "EXACT",
      splits: formInput.splitBetween.map((id) => ({
        userId: id,
        amount: Number(formInput.splits[id]),
      })),
      expenseDate: formInput.createdAt,
    });

    resetForm();
    return;
  }

  // EQUAL SPLIT
  onAddExpense({
    groupId,
    title: formInput.title.trim(),
    note: formInput.description.trim(),
    amount: numericAmount,
    paidBy: formInput.paidBy,
    splitType: "EQUAL",
    splitBetween: formInput.splitBetween,
    expenseDate: formInput.createdAt,
  });

  resetForm();
};

  /**
   * UI-only equal split preview
   */
  const equalAmount =
    formInput.amount && formInput.splitBetween.length > 0
      ? (Number(formInput.amount) / formInput.splitBetween.length).toFixed(2)
      : null;

  return {
    formInput,
    setFormInput,
    handleSubmit,
    equalAmount,
    isSubmitDisabled,
    submitErrorReason,
    isSuspiciousAmount,
  };
}
