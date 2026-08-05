import { useState, useEffect } from "react";

/**
 * useExpenseForm
 * Centralizes expense form logic.
 * UI and backend share the same splitType values:
 * - EQUAL
 * - EXACT
 */
export function useExpenseForm({
  groupId,
  onAddExpense,
  initialData = null,
  isEdit = false,
}) {
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

  // 🔁 PREFILL FOR EDIT
  useEffect(() => {
    if (isEdit && initialData) {
      setFormInput({
        title: initialData.title || "",
        amount: initialData.amount || "",
        paidBy: initialData.paidBy?._id || initialData.paidBy,
        splitType: initialData.splitType || "EQUAL",
        splitBetween: Array.isArray(initialData.splits)
          ? initialData.splits.map((s) => s.userId?._id || s.userId)
          : [],
        splits:
          initialData.splitType === "EXACT"
            ? initialData.splits.reduce((acc, s) => {
                acc[s.userId?._id || s.userId] = s.amount;
                return acc;
              }, {})
            : {},
        createdAt: initialData.expenseDate
          ? initialData.expenseDate.split("T")[0]
          : "",
        description: initialData.note || "",
      });
    }
  }, [isEdit, initialData?._id]);

  const numericAmount = Number(formInput.amount);
  const isValidAmount = !Number.isNaN(numericAmount) && numericAmount > 0;

  const isSuspiciousAmount =
    isValidAmount && numericAmount >= LARGE_AMOUNT_THRESHOLD;

  // Paid by member must be included in splitBetween (enforced by backend for both EQUAL & EXACT)
  const isPaidByInSplit = formInput.paidBy
    ? formInput.splitBetween.includes(formInput.paidBy)
    : true;

  // Real-time validation for EXACT split total
  const exactSplitSumValid = (() => {
    if (formInput.splitType !== "EXACT") return true;

    for (const id of formInput.splitBetween) {
      if (
        formInput.splits[id] === undefined ||
        formInput.splits[id] === ""
      ) {
        return false;
      }
    }
    const total = Object.values(formInput.splits).reduce(
      (sum, v) => sum + Number(v),
      0
    );
    return Number(total.toFixed(2)) === numericAmount;
  })();

  // Disable submit button when invalid
  const isSubmitDisabled =
    !formInput.title.trim() ||
    !formInput.amount ||
    !isValidAmount ||
    !formInput.paidBy ||
    formInput.splitBetween.length < 2 ||
    !formInput.createdAt ||
    !isPaidByInSplit ||
    !exactSplitSumValid;

  const submitErrorReason = (() => {
    if (!formInput.title.trim()) return "Enter expense title";
    if (!formInput.amount || !isValidAmount) return "Enter a valid amount";
    if (!formInput.paidBy) return "Select who paid";
    if (formInput.splitBetween.length < 2)
      return "Select at least 2 members";
    if (!isPaidByInSplit) return "Payer must be included in split";
    if (!formInput.createdAt) return "Select date";
    if (!exactSplitSumValid) return "Split amounts must add up to total";
    return null;
  })();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    /* ===============================
       EDIT + EQUAL SPLIT (Penny-Rounding Fix)
       =============================== */
    if (isEdit && formInput.splitType === "EQUAL") {
      const memberCount = formInput.splitBetween.length;
      const baseShare = Math.floor((numericAmount / memberCount) * 100) / 100;
      const splitsArray = formInput.splitBetween.map((id) => ({
        userId: id,
        amount: baseShare,
      }));

      const currentTotal = splitsArray.reduce((sum, s) => sum + s.amount, 0);
      const residual = Number((numericAmount - currentTotal).toFixed(2));

      // Residual added to paidBy member
      const payerSplit = splitsArray.find((s) => s.userId === formInput.paidBy);
      if (payerSplit) {
        payerSplit.amount = Number((payerSplit.amount + residual).toFixed(2));
      }

      onAddExpense({
        title: formInput.title.trim(),
        note: formInput.description.trim(),
        amount: numericAmount,
        paidBy: formInput.paidBy,
        splitType: "EQUAL",
        splits: splitsArray,
        expenseDate: formInput.createdAt,
      });

      return;
    }

    /* ===============================
       EXACT SPLIT (ADD + EDIT)
       =============================== */
    if (formInput.splitType === "EXACT") {
      onAddExpense({
        ...(isEdit ? {} : { groupId }),
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

      if (!isEdit) resetForm();
      return;
    }

    /* ===============================
       ADD + EQUAL (UNCHANGED)
       =============================== */
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

    if (!isEdit) resetForm();
  };

  /**
   * UI-only equal split preview
   */
  const equalAmount =
    isValidAmount && formInput.splitBetween.length > 0
      ? (
          numericAmount /
          formInput.splitBetween.length
        ).toFixed(2)
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