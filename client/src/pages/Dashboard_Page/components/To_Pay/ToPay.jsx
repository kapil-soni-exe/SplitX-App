import React, { useState } from "react";
import SettlementSelector from "./SettlementSelector";
import "./ToPay.css";
import Model from "../../../../components/comman/Model";
import EmptyState from "../../../../components/comman/EmptyState";
import { RiCheckDoubleLine, RiArrowRightSLine } from "@remixicon/react";

function ToPay({ payList = [], onConfirmSettlement }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPersonList, setSelectedPersonList] = useState([]);

  const total = payList.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const handleOpenAll = () => {
    setSelectedPersonList(payList);
    setIsOpen(true);
  };

  const handleOpenRow = (person) => {
    setSelectedPersonList([person]);
    setIsOpen(true);
  };

  return (
    <>
      <div className="pay-card">
        <div className="pay-header">
          <h3>You Need To Pay</h3>
          <p>In this group</p>
        </div>

        <div className="pay-body">
          {payList.length === 0 ? (
            <div className="pay-empty-wrapper">
              <EmptyState
                title="All Settled!"
                description="You don't owe anyone in this group. Coffee on you? ☕"
                icon={<RiCheckDoubleLine size={80} />}
              />
            </div>
          ) : (
            payList.map((person) => (
              <div
                key={person.userId}
                className="pay-row"
                tabIndex={0}
                role="button"
                aria-label={`Pay ₹${person.amount} to ${person.name}`}
                onClick={() => handleOpenRow(person)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenRow(person);
                  }
                }}
              >
                <div className="pay-left">
                  <div className="pay-avatar" aria-hidden="true">
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
              onClick={handleOpenAll}
            >
              Settle Up
            </button>
          </div>
        )}
      </div>

      {/* Settlement Modal */}
      <Model
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <SettlementSelector
          list={selectedPersonList}
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