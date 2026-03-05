import React from "react";
import "./GroupSummary.css";
import { RiArrowDownSLine } from "@remixicon/react";
import DonutChart from "./DonutChart";

function GroupSummary({
  groups = [],
  selectedGroupId,
  onGroupChange,

  groupName,
  totalSpent,
  userPaid,
  userShare,
  netBalance,
  expensesCount,
}) {
  return (
    <div className="group-summary">
      {/* Header */}
      <div className="gs-header">
        <div>
          <h2 className="gs-title">Group Summary</h2>
          <p className="gs-subtitle">{groupName}</p>
        </div>

        {/* DROPDOWN */}
        <div className="gs-dropdown-wrapper">
          <select
            className="gs-dropdown"
            value={selectedGroupId}
            onChange={(e) => onGroupChange(e.target.value)}
          >
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
          <RiArrowDownSLine size={22} className="gs-dropdown-icon" />
        </div>
      </div>

      {/* Main */}
      <div className="gs-main">
        <div className="ring-wrap">
          <div className="gs-ring">
            <DonutChart
              total={totalSpent}
              paid={userPaid}
              netBalance={netBalance}
            />
          </div>

          <div className="gs-ring-center">
            <p className="ring-label">TOTAL SPENT</p>
            <h2 className="ring-value">₹{totalSpent}</h2>
          </div>
        </div>

        {/* Side Stats */}
        <div className="gs-stats">
          <div className="gs-stat">
            <span>You Paid</span>
            <strong>₹{userPaid}</strong>
          </div>
          <div className="gs-stat">
            <span>Your Share</span>
            <strong>₹{userShare}</strong>
          </div>

          <div
            className={`gs-stat highlight ${
              netBalance > 0 ? "positive" : netBalance < 0 ? "negative" : ""
            }`}
          >
            {netBalance === 0 ? "All Settled 🎉" : `₹${netBalance}`}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="gs-footer">
        <span>{expensesCount} expenses</span>
        <span>Updated today</span>
      </div>
    </div>
  );
}

export default GroupSummary;