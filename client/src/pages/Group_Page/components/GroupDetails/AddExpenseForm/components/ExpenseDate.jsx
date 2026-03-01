import Input from "../../../../../../components/comman/Input";

/**
 * ExpenseDate
 * Handles expense date selection.
 
 */
function ExpenseDate({ date, setFormInput }) {
  return (
    <Input
      label="Date"
      type="date"
      value={date}
      onChange={(e) =>
        setFormInput((prev) => ({
          ...prev,
          createdAt: e.target.value,
        }))
      }
    />
  );
}

export default ExpenseDate;