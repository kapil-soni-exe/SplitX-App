/**
 * PaidBySelect
 * -----------------
 * Handles selection of the user who paid the expenses
 *
 */
function PaidBySelect({ members, paidBy, setFormInput }) {
  return (
    <div className="form-field">
      <label>Paid By</label>

      <select
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

        {members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PaidBySelect;