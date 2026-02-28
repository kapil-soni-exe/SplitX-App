import React from "react";
import { RiArrowRightSLine } from "@remixicon/react";
import "./ToPay.css";

function ToPay({ payList = [] }) {
  const total = payList.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="pay-card">
      <div className="pay-header">
        <h3>You Need To Pay</h3>
        <p>In this group</p>
      </div>

      <div className="pay-body">
        {payList.length === 0 ? (
          <div className="pay-empty">
            🎉 You don't need to pay anyone in this group!
          </div>
        ) : (
          payList.map((person) => (
            <div key={person.userId} className="pay-row">
              <div className="pay-left">
                <div className="pay-avatar">
                  {person.name?.[0]}
                </div>
                <span className="pay-name">
                  {person.name}
                </span>
              </div>

              <div className="pay-right">
                <span className="pay-amount">
                  ₹{person.amount}
                </span>
                <RiArrowRightSLine size={20} />
              </div>
            </div>
          ))
        )}
      </div>

      {payList.length > 0 && (
        <div className="pay-footer">
          <div className="pay-total">
            <span>Total to Pay</span>
            <strong>₹{total}</strong>
          </div>

          <button className="pay-btn">
            Settle Up
          </button>
        </div>
      )}
    </div>
  );
}

export default ToPay;