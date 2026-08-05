import React, { useState } from "react";
import "./AddExpenseForm.css";
import Button from "../../../../../components/comman/Button";
import { RiErrorWarningLine } from "@remixicon/react";

import { useExpenseForm } from "./hooks/useExpenseForm";

import ExpenseBasicInfo from "./components/ExpenseBasicInfo";
import PaidBySelect from "./components/PaidBySelect";
import SplitTypeToggle from "./components/SplitTypeToggle";
import SplitMembersList from "./components/SplitMembersList";
import ExpenseDate from "./components/ExpenseDate";
import ScanReceiptButton from "./components/ScanReceiptButton";
import DuplicateWarningBanner from "./components/DuplicateWarningBanner";

/**
 * AddExpenseForm
 * -----------------
 * All form logic is handled inside useExpenseForm hook.
 * Receipt scan flow: ScanReceiptButton → prefill formInput → show DuplicateWarningBanner if needed.
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

  // Receipt scan state
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [lowConfidenceWarning, setLowConfidenceWarning] = useState(false);

  /* ── Scan handlers ─────────────────────────────────────────────────────── */
  const handleScanComplete = (data) => {
    // Pre-fill form fields from extracted receipt data
    setFormInput((prev) => ({
      ...prev,
      title: data.title ?? prev.title,
      amount: data.amount != null ? String(data.amount) : prev.amount,
      createdAt: data.date ?? prev.createdAt,
    }));

    // Clear any previous scan error
    setScanError(null);

    // Set duplicate warning if backend found similar expenses
    if (data.duplicateWarning?.matches?.length) {
      setDuplicateWarning(data.duplicateWarning.matches);
    } else {
      setDuplicateWarning(null);
    }

    // Warn user if AI confidence was low
    setLowConfidenceWarning(data.confidence === "low");
  };

  const handleScanError = (message) => {
    setScanError(message);
    setDuplicateWarning(null);
    setLowConfidenceWarning(false);
  };

  return (
    <form className="add-expense-form" onSubmit={handleSubmit}>
      <h3 className="form-title">{isEdit ? "Edit Expense" : "Add Expense"}</h3>

      {/* ── Receipt Scan Section (only for new expenses) ─────────────────── */}
      {!isEdit && !initialData && (
        <div className="scan-receipt-section">
          <ScanReceiptButton
            groupId={groupId}
            onScanComplete={handleScanComplete}
            onScanError={handleScanError}
          />
          {/* Scan error inline */}
          {scanError && (
            <div className="form-alert error-alert">
              <RiErrorWarningLine size={16} />
              <span>{scanError}</span>
            </div>
          )}

          {/* Low confidence nudge */}
          {lowConfidenceWarning && (
            <div className="form-alert warning-alert">
              <RiErrorWarningLine size={16} />
              <span>Image was unclear — please verify the extracted details.</span>
            </div>
          )}

          {/* Duplicate warning banner */}
          {duplicateWarning && (
            <DuplicateWarningBanner
              matches={duplicateWarning}
              onDismiss={() => setDuplicateWarning(null)}
            />
          )}

          <div className="scan-divider">OR</div>
        </div>
      )}

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