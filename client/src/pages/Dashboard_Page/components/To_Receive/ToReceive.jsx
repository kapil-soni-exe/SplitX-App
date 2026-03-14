import React, { useState } from "react";
import "./ToReceive.css";
import { RiArrowRightSLine } from "@remixicon/react";
import SettlementSelector from "../To_Pay/SettlementSelector";
import Model from "../../../../components/comman/Model";

function ToReceive({ receiveList = [], onConfirmCollection }) {
  const [isOpen, setIsOpen] = useState(false);

  const total = receiveList.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <>
      <div className="receive-card">
        <div className="receive-header">
          <h3>You Will Receive</h3>
          <p>In this group</p>
        </div>

        <div className="receive-body">
          {receiveList.length === 0 ? (
            <div className="receive-empty">
              🎉 Nothing to collect here!
            </div>
          ) : (
            receiveList.map((person) => (
              <div
                key={person.userId}
                className="receive-row"
              >
                <div className="receive-left">
                  <div className="receive-avatar">
                    {person.name?.[0]}
                  </div>
                  <span className="receive-name">
                    {person.name}
                  </span>
                </div>

                <div className="receive-right">
                  <span className="receive-amount">
                    ₹{person.amount}
                  </span>
                  <RiArrowRightSLine size={20} />
                </div>
              </div>
            ))
          )}
        </div>

        {receiveList.length > 0 && (
          <div className="receive-footer">
            <div className="receive-total">
              <span>Total to Receive</span>
              <strong>₹{total}</strong>
            </div>

            <button
              className="receive-btn"
              onClick={() => setIsOpen(true)}
            >
              Collect
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Model
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <SettlementSelector
          list={receiveList}
          mode="collect"
          onConfirm={(selectedUsers) => {
            onConfirmCollection(selectedUsers);
            setIsOpen(false);
          }}
        />
      </Model>
    </>
  );
}

export default ToReceive;