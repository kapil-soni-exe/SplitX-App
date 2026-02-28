import React from "react";
import "./dashboard.css";

import ToPay from "./components/To_Pay/ToPay";
import ToReceive from "./components/To_Receive/ToReceive";
import ButtonAction from "./components/ButtonAction";
// import RecentActivity from "./components/RecentActivity/RecentActivity";
import GroupSnapshot from "./components/GroupSnapshot";
import InsightsCard from "./components/InsightsCard";
import GroupSummary from "./components/GroupSummary/GroupSummary";

import { useDashboard } from "../../hooks/useDashboard";

function Dashboard() {
  const { groups, selectedGroupId, setSelectedGroupId, group, loading, error } =
    useDashboard();

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Something went wrong</div>;
  if (!group) return <div>No group data</div>;

  const {
    name,
    totalSpent,
    userPaid,
    userShare,
    netBalance,
    payList = [],
    receiveList = [],
    expenseCount,
  } = group;

  console.log("expenses:", expenseCount);

  return (
    <div className="dashboard-grid">
      <div className="cards hero-cards col-6">
        <GroupSummary
          groups={groups}
          selectedGroupId={selectedGroupId}
          onGroupChange={setSelectedGroupId}
          groupName={name}
          totalSpent={totalSpent}
          userPaid={userPaid}
          userShare={userShare}
          expensesCount={expenseCount}
        />
      </div>

      <div className="cards col-3">
        <ToPay payList={payList} netBalance={netBalance} />
      </div>

      <div className="cards col-3">
        <ToReceive receiveList={receiveList} netBalance={netBalance} />
      </div>

      <div className="col-12">
        <ButtonAction />
      </div>

      <div className="cards col-12">
        {/* <RecentActivity groups={groups} /> */}
      </div>

      <div className="cards col-6">
        <GroupSnapshot />
      </div>

      <div className="cards col-6">
        <InsightsCard />
      </div>
    </div>
  );
}

export default Dashboard;
