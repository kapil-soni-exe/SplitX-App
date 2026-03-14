/**
 * PaidBySelect
 * -----------------
 * Handles selection of the user who paid the expense
 *
 * Note:
 * members now have structure:
 *
 * {
 *   userId: { _id, name, avatar },
 *   joinedAt: Date
 * }
 */

function PaidBySelect({ members = [], paidBy, setFormInput }) {
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

        {members.map((member) => {
          const user = member.userId;

          // safety check in case userId not populated
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