import React from "react";
import "./AddExpenseForm.css";
import Button from "../../../../../components/comman/Button";
import { RiErrorWarningLine } from "@remixicon/react";

import { useExpenseForm } from "./hooks/useExpenseForm";

import ExpenseBasicInfo from "./components/ExpenseBasicInfo";
import PaidBySelect from "./components/PaidBySelect";
import SplitTypeToggle from "./components/SplitTypeToggle";
import SplitMembersList from "./components/SplitMembersList";
import ExpenseDate from "./components/ExpenseDate";

/**
 * AddExpenseForm
 * -----------------
 * All form logic is handled inside useExpenseForm hook.
 */
function AddExpenseForm({
  members = [],
  groupId,
  onAddExpense,
  initialData = null,
  isEdit = false,
}) {
  const {
    formInput,
    setFormInput,
    handleSubmit,
    equalAmount,
    isSubmitDisabled,
    submitErrorReason,
    isSuspiciousAmount,
  } = useExpenseForm({ groupId, onAddExpense, initialData, isEdit });

  return (
    <form className="add-expense-form" onSubmit={handleSubmit}>
      <h3 className="form-title">{isEdit ? "Edit Expense" : "Add Expense"}</h3>

      {/* Hero Section: Title & Amount + Collapsible Note */}
      <ExpenseBasicInfo formInput={formInput} setFormInput={setFormInput} />

      {/* Paid By & Date in a single side-by-side row */}
      <div className="form-row">
        <PaidBySelect
          members={members}
          paidBy={formInput.paidBy}
          setFormInput={setFormInput}
        />

        <ExpenseDate date={formInput.createdAt} setFormInput={setFormInput} />
      </div>

      {/* Split Section */}
      <div className="split-section">
        <SplitTypeToggle
          splitType={formInput.splitType}
          setFormInput={setFormInput}
        />

        <SplitMembersList
          members={members}
          formInput={formInput}
          setFormInput={setFormInput}
          equalAmount={equalAmount}
        />
      </div>

      {/* Alerts */}
      {isSuspiciousAmount && (
        <div className="form-alert warning-alert">
          <RiErrorWarningLine size={16} />
          <span>This amount looks high. Please double-check before submitting.</span>
        </div>
      )}

      {submitErrorReason && (
        <div className="form-alert error-alert">
          <RiErrorWarningLine size={16} />
          <span>{submitErrorReason}</span>
        </div>
      )}

      {/* Sticky Footer Submit Button */}
      <div className="form-sticky-footer">
        <Button
          type="submit"
          text={isEdit ? "Update Expense" : "Add Expense"}
          variant="primary"
          disabled={isSubmitDisabled}
          title={submitErrorReason || ""}
        />
      </div>
    </form>
  );
}

export default AddExpenseForm;