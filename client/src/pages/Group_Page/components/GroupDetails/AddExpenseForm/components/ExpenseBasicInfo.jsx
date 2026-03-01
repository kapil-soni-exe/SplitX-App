import Input from "../../../../../../components/comman/Input";

/**
 * ExpenseBasicInfo
 * -----------------
 * Handles only basic expense information UI:
 * - Title
 * - Amount
 * - Description
 */
function ExpenseBasicInfo({ formInput, setFormInput }) {
  return (
    <>
      {/* Title and Amount inputs */}
      <div className="form-row">
        <Input
          label="Title"
          value={formInput.title}
          onChange={(e) =>
            setFormInput((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />

        <Input
          type="number"
          label="Amount"
          value={formInput.amount}
          onChange={(e) =>
            setFormInput((prev) => ({
              ...prev,
              amount: e.target.value,
            }))
          }
        />
      </div>

      {/* Optional description textarea */}
      <div className="form-field">
        <label>Description (optional)</label>
        <textarea
          className="form-textarea"
          rows={2}
          value={formInput.description}
          onChange={(e) =>
            setFormInput((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>
    </>
  );
}

export default ExpenseBasicInfo;