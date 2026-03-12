import React, { useEffect, useState } from "react";
import ConfirmModel from "../../../../components/comman/ConfirmModel";
import "./SettlementSelector.css";

function SettlementSelector({
  list = [],
  onConfirm,
  autoSelectAll = true,
  mode = "pay", // "pay" | "collect"
}) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (autoSelectAll) {
      setSelectedUsers(list);
    }
  }, [list, autoSelectAll]);

  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.userId === user.userId)
        ? prev.filter((u) => u.userId !== user.userId)
        : [...prev, user]
    );
  };

  const total = selectedUsers.reduce(
    (sum, user) => sum + user.amount,
    0
  );

  const handleFinalConfirm = () => {
    onConfirm(selectedUsers);
    setShowConfirm(false);
  };

  const title =
    mode === "pay" ? "Select settlements" : "Select collections";

  const confirmTitle =
    mode === "pay" ? "Confirm Settlement" : "Confirm Collection";

  const confirmDescription =
    mode === "pay"
      ? `You are settling ₹${total} with ${selectedUsers.length} member(s).`
      : `You are collecting ₹${total} from ${selectedUsers.length} member(s).`;

  const confirmButtonText =
    mode === "pay" ? "Confirm Settlement" : "Confirm Collection";

  return (
    <>
      <div className="settlement-selector">
        <h3 className="selector-title">{title}</h3>

        <div className="selector-list">
          {list.map((user) => (
            <div key={user.userId} className="selector-row">
              <label>
                <input
                  type="checkbox"
                  checked={selectedUsers.some(
                    (u) => u.userId === user.userId
                  )}
                  onChange={() => toggleUser(user)}
                />
                <span className="selector-name">
                  {user.name}
                </span>
              </label>

              <span className="selector-amount">
                ₹{user.amount}
              </span>
            </div>
          ))}
        </div>

        <div className="selector-footer">
          <div className="selector-total">
            Total: <strong>₹{total}</strong>
          </div>

          <button
            className="selector-confirm"
            disabled={selectedUsers.length === 0}
            onClick={() => setShowConfirm(true)}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>

      <ConfirmModel
        isOpen={showConfirm}
        title={confirmTitle}
        description={confirmDescription}
        confirmText={
          mode === "pay" ? "Yes, Settle" : "Yes, Collect"
        }
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleFinalConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}

export default SettlementSelector;