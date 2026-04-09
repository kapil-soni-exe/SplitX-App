import React, { useState } from "react";
import SettlementSelector from "./SettlementSelector";
import "./ToPay.css";
import Model from "../../../../components/comman/Model"
import EmptyState from "../../../../components/comman/EmptyState";
import { RiCheckDoubleLine, RiArrowRightSLine } from "@remixicon/react";

function ToPay({ payList = [], onConfirmSettlement }) {
  const [isOpen, setIsOpen] = useState(false);

  const total = payList.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <>
      <div className="pay-card">
        <div className="pay-header">
          <h3>You Need To Pay</h3>
          <p>In this group</p>
        </div>

        <div className="pay-body">
          {payList.length === 0 ? (
            <EmptyState
              title="All Settled!"
              description="You don't owe anyone in this group. Coffee on you? ☕"
              icon={<RiCheckDoubleLine size={80} />}
            />
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

            <button
              className="pay-btn"
              onClick={() => setIsOpen(true)}
            >
              Settle Up
            </button>
          </div>
        )}
      </div>

      {/* 🔥 Modal */}
      <Model
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      
      >
        
         <SettlementSelector
          list={payList}
          mode="pay"
          onConfirm={(selectedUsers) => {
            onConfirmSettlement(selectedUsers);
            setIsOpen(false);
          }}
        />
      </Model>
    </>
  );
}

export default ToPay;