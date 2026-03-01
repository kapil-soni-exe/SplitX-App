import "./AddExpenseForm.css";
import Button from "../../../../../components/comman/Button";

import { useExpenseForm } from "./hooks/useExpenseForm";

import ExpenseBasicInfo from "./components/ExpenseBasicInfo";
import PaidBySelect from "./components/PaidBySelect";
import SplitTypeToggle from "./components/SplitTypeToggle";
import SplitMembersList from "./components/SplitMembersList";
import ExpenseDate from "./components/ExpenseDate";

/**
 * AddExpenseForm
 * -----------------

 * All logic is handled inside useExpenseForm hook.
 */
function AddExpenseForm({ members = [], groupId, onAddExpense }) {
  const {
    formInput,
    setFormInput,
    handleSubmit,
    equalAmount,
    isSubmitDisabled,
    submitErrorReason,
    isSuspiciousAmount
  } = useExpenseForm({ groupId, onAddExpense });

  return (
    <form className="add-expense-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Add Expense</h3>

      <ExpenseBasicInfo
        formInput={formInput}
        setFormInput={setFormInput}
      />

      <PaidBySelect
        members={members}
        paidBy={formInput.paidBy}
        setFormInput={setFormInput}
      />

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

      <ExpenseDate
        date={formInput.createdAt}
        setFormInput={setFormInput}
      />

      {isSuspiciousAmount && (
  <p style={{ color: "orange", fontSize: "12px" }}>
    ⚠️ This amount looks high. Please double-check before submitting.
  </p>
)}
      {submitErrorReason && (
  <p style={{ color: "red", fontSize: "12px" }}>
    {submitErrorReason}
  </p>
)}
      <Button type="submit" text="Submit" variant="primary" disabled={isSubmitDisabled} title={submitErrorReason || ""} />
    </form>
  );
}

export default AddExpenseForm;