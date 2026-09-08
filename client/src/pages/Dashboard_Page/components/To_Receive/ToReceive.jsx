import React, { useState } from "react";
import "./ToReceive.css";
import SettlementSelector from "../To_Pay/SettlementSelector";
import Model from "../../../../components/comman/Model";
import EmptyState from "../../../../components/comman/EmptyState";
import { RiCheckDoubleLine, RiArrowRightSLine } from "@remixicon/react";

function ToReceive({ receiveList = [], onConfirmCollection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPersonList, setSelectedPersonList] = useState([]);

  const total = receiveList.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const handleOpenAll = () => {
    setSelectedPersonList(receiveList);
    setIsOpen(true);
  };

  const handleOpenRow = (person) => {
    setSelectedPersonList([person]);
    setIsOpen(true);
  };

  return (
    <>
      <div className="receive-card">
        <div className="receive-header">
          <h3>You Will Receive</h3>
          <p>In this group</p>
        </div>

        <div className="receive-body">
          {receiveList.length === 0 ? (
            <div className="receive-empty-wrapper">
              <EmptyState
                title="Nothing to collect"
                description="No one owes you in this group right now. Time to start a new expense?"
                icon={<RiCheckDoubleLine size={80} />}
              />
            </div>
          ) : (
            receiveList.map((person) => (
              <div
                key={person.userId}
                className="receive-row"
                tabIndex={0}
                role="button"
                aria-label={`Collect ₹${person.amount} from ${person.name}`}
                onClick={() => handleOpenRow(person)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenRow(person);
                  }
                }}
              >
                <div className="receive-left">
                  <div className="receive-avatar" aria-hidden="true">
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
              onClick={handleOpenAll}
            >
              Collect
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