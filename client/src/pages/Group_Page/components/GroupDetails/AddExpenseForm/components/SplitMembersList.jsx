import React from "react";
import { RiCheckLine } from "@remixicon/react";

/**
 * SplitMembersList
 * Renders member avatar-chips for split selection.
 */
function SplitMembersList({
  members = [],
  formInput,
  setFormInput,
  equalAmount,
}) {
  return (
    <div className="split-members-grid">
      {members.map((member) => {
        const user = member.userId;
        if (!user) return null;

        const memberId = user._id;
        const checked = formInput.splitBetween.includes(memberId);
        const isPaidBy = formInput.paidBy === memberId;
        const initialLetter = user.name ? user.name.charAt(0).toUpperCase() : "?";

        const handleToggle = () => {
          const isChecked = !checked;

          setFormInput((prev) => ({
            ...prev,
            splitBetween: isChecked
              ? [...prev.splitBetween, memberId]
              : prev.splitBetween.filter((id) => id !== memberId),

            // Remove split amount when unchecked
            splits: isChecked
              ? prev.splits
              : Object.fromEntries(
                  Object.entries(prev.splits).filter(
                    ([id]) => id !== memberId
                  )
                ),
          }));
        };

        return (
          <div
            key={memberId}
            className={`member-chip-card ${checked ? "selected" : ""} ${
              isPaidBy ? "paid-by" : ""
            }`}
          >
            <label
              htmlFor={`member-check-${memberId}`}
              className="member-chip-main"
            >
              <input
                id={`member-check-${memberId}`}
                type="checkbox"
                className="chip-checkbox-hidden"
                checked={checked}
                onChange={handleToggle}
              />

              <div className="chip-avatar-wrapper">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="chip-avatar-img"
                  />
                ) : (
                  <div className="chip-avatar-initial">{initialLetter}</div>
                )}
                {checked && (
                  <div className="chip-checkmark">
                    <RiCheckLine size={12} />
                  </div>
                )}
              </div>

              <div className="chip-info">
                <span className="chip-name">{user.name}</span>
                {isPaidBy && <span className="paid-by-badge">Paid</span>}
              </div>

              {checked && formInput.splitType === "EQUAL" && equalAmount && (
                <span className="chip-equal-amount">₹{equalAmount}</span>
              )}
            </label>

            {checked && formInput.splitType === "EXACT" && (
              <div className="chip-exact-input-wrap">
                <span className="exact-currency">₹</span>
                <input
                  id={`split-amount-${memberId}`}
                  type="number"
                  className="chip-amount-input"
                  placeholder="0"
                  value={formInput.splits[memberId] ?? ""}
                  onChange={(e) => {
                    const value = Number(e.target.value || 0);

                    setFormInput((prev) => ({
                      ...prev,
                      splits: {
                        ...prev.splits,
                        [memberId]: value,
                      },
                    }));
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SplitMembersList;