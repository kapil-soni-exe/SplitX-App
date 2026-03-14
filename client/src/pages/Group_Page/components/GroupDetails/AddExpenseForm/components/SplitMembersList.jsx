/**
 * SplitMembersList
 * Renders the list of members involved in the split.
 *
 * Responsibilities:
 * - Checkbox selection for split members
 * - Show equal split preview OR unequal input
 * - Highlight paid-by member
 *
 * members structure:
 * {
 *   userId: { _id, name, avatar },
 *   joinedAt: Date
 * }
 */

function SplitMembersList({
  members = [],
  formInput,
  setFormInput,
  equalAmount,
}) {
  return (
    <div className="split-list">
      {members.map((member) => {

        const user = member.userId;

        // safety check if userId not populated
        if (!user) return null;

        const memberId = user._id;

        const checked = formInput.splitBetween.includes(memberId);
        const isPaidBy = formInput.paidBy === memberId;

        return (
          <div
            key={memberId}
            className={`split-checkbox ${isPaidBy ? "paid-by" : ""}`}
          >

            {/* Member selection checkbox */}
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {

                const isChecked = e.target.checked;

                setFormInput((prev) => ({
                  ...prev,

                  splitBetween: isChecked
                    ? [...prev.splitBetween, memberId]
                    : prev.splitBetween.filter(
                        (id) => id !== memberId
                      ),

                  // Remove split amount when unchecked
                  splits: isChecked
                    ? prev.splits
                    : Object.fromEntries(
                        Object.entries(prev.splits).filter(
                          ([id]) => id !== memberId
                        )
                      ),
                }));
              }}
            />

            {/* Member name + paid badge */}
            <span className="member-name">
              {user.name}

              {isPaidBy && (
                <span className="paid-by-badge">
                  Paid
                </span>
              )}
            </span>


            {/* Amount display / input */}
            {checked &&
              (formInput.splitType === "EQUAL" ? (
                <span className="member-amount">
                  ₹ {equalAmount}
                </span>
              ) : (
                <input
                  type="number"
                  className="split-amount-input"
                  placeholder="₹"
                  value={formInput.splits[memberId] || ""}
                  onChange={(e) => {

                    const value = Number(
                      e.target.value || 0
                    );

                    setFormInput((prev) => ({
                      ...prev,
                      splits: {
                        ...prev.splits,
                        [memberId]: value,
                      },
                    }));
                  }}
                />
              ))}
          </div>
        );
      })}
    </div>
  );
}

export default SplitMembersList;