/**
 * SettleModal
 * -----------
 * Shows the current user's payList (who they owe) and lets them
 * record a settlement with a single "Settle" click per person.
 */

import React, { useState } from "react";
import "./SettleModal.css";

function SettleModal({ payList = [], receiveList = [], onSettle, creating }) {
  const [loadingId, setLoadingId] = useState(null); // track which row is settling

  const handleSettle = async (item) => {
    setLoadingId(item.userId);
    await onSettle({ to: item.userId, amount: item.amount });
    setLoadingId(null);
  };

  const allSettled = payList.length === 0 && receiveList.length === 0;

  return (
    <div className="settle-modal">
      <h3 className="settle-modal-title">Settle Up</h3>

      {/* ── You owe ── */}
      {payList.length > 0 && (
        <section className="settle-section">
          <p className="settle-section-label">You owe</p>
          <ul className="settle-list">
            {payList.map((item) => (
              <li key={item.userId} className="settle-row">
                <div className="settle-avatar">{item.name?.[0]}</div>
                <div className="settle-info">
                  <span className="settle-name">{item.name}</span>
                  <span className="settle-amount owe">₹{item.amount.toFixed(2)}</span>
                </div>
                <button
                  className="settle-pay-btn"
                  disabled={creating || loadingId === item.userId}
                  onClick={() => handleSettle(item)}
                >
                  {loadingId === item.userId ? "Settling…" : "Settle"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── You'll receive ── */}
      {receiveList.length > 0 && (
        <section className="settle-section">
          <p className="settle-section-label">You will receive</p>
          <ul className="settle-list">
            {receiveList.map((item) => (
              <li key={item.userId} className="settle-row receive-row">
                <div className="settle-avatar">{item.name?.[0]}</div>
                <div className="settle-info">
                  <span className="settle-name">{item.name}</span>
                  <span className="settle-amount receive">₹{item.amount.toFixed(2)}</span>
                </div>
                <span className="settle-pending-tag">Awaiting</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── All settled ── */}
      {allSettled && (
        <div className="settle-all-done">
          <span className="settle-done-icon">✅</span>
          <p>All balances are settled!</p>
        </div>
      )}
    </div>
  );
}

export default SettleModal;
