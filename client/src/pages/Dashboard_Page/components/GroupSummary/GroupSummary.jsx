import React from "react";
import "./GroupSummary.css";
import { RiArrowDownSLine } from "@remixicon/react";
import { getTotalSpent,getUserPaid,getUserShare } from "../../../../utils/calculation/calculation";
import DonutChart from "./DonutChart";


function GroupSummary({groups,currentUserId}) {

 const totalspent = getTotalSpent(groups)
 const UserPaid = getUserPaid(groups,currentUserId)
 const UserShare=getUserShare(groups,currentUserId)
console.log(getUserShare(groups,currentUserId))
    
  return (
    <div className="group-summary">
      {/* Header */}
      <div className="gs-header">
        <div>
          <h2 className="gs-title">Group Summary</h2>
          <p className="gs-subtitle">{groups.name}</p>
        </div>
        <button className="gs-dropdown">
          {}
          <span>
            <RiArrowDownSLine size={22} />
          </span>
        </button>
      </div>
      {/* Main */}
      <div className="gs-main">
        <div className="ring-wrap">
            <div className="gs-ring">
    <DonutChart
      total={totalspent}
      paid={UserPaid}
      share={UserShare}
    />
  </div>
          <div className="gs-ring-center">
            <p className="ring-label">TOTAL SPENT</p>
            <h2 className="ring-value">{totalspent}</h2>
          </div>
        </div>

        {/* Side States */}
        <div className="gs-stats">
          <div className="gs-stat">
            <span>You Paid</span>
            <strong>{UserPaid}</strong>
          </div>
          <div className="gs-stat">
            <span>Your Share</span>
            <strong>{UserShare}</strong>
          </div>
          <div className="gs-stat highlight positive">{UserPaid - UserShare}</div>
        </div>
      </div>
        

        <div className="gs-footer">
          <span>{groups.expenses.length} expenses</span>
          <span>Update Today</span>
        </div>
      
    </div>
  );
}

export default GroupSummary;
