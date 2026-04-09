import React from "react";
import "./dashboard.css";

import ToPay from "./components/To_Pay/ToPay";
import ToReceive from "./components/To_Receive/ToReceive";
import RecentActivity from "./components/RecentActivity/RecentActivity";
import GroupSnapshot from "./components/GroupSnapshot";
import InsightsCard from "./components/InsightsCard";
import GroupSummary from "./components/GroupSummary/GroupSummary";

import { useDashboard } from "../../hooks/useDashboard";
import { useGroupSettlement } from "../../hooks/useGroupSettlement";
import Spinner from "../../components/Loaders/Spinner";
import DashboardSkeleton from "../../components/Loaders/DashboardSkeleton";

import EmptyState from "../../components/comman/EmptyState";
import { RiGroupLine } from "@remixicon/react";

function Dashboard() {
  const {
    groups,
    selectedGroupId,
    setSelectedGroupId,
    group,
    loading,
    error,
    refreshGroup,
  } = useDashboard();
  const { handleCreateSettlement } = useGroupSettlement(selectedGroupId);

  if (loading) return <DashboardSkeleton />;
  if (error) return <div>Something went wrong</div>;

  if (!group || groups.length === 0) {
    return (
      <EmptyState
        title="No groups found"
        description="Your split journey starts here! Create a group to begin tracking shared expenses with friends."
        icon={<RiGroupLine size={80} />}
        cta={{
          text: "Create Your First Group",
          onClick: () => (window.location.href = "/groups"),
        }}
      />
    );
  }

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

  async function handleConfirmSettlement(selectedUsers) {
    try {
      for (let user of selectedUsers) {
        await handleCreateSettlement({
          to: user.userId,
          amount: user.amount,
          note: "Dashboard settlement",
        });
      }

      console.log("Settlement successful");

      await refreshGroup();
    } catch (err) {
      console.error("Settlement failed", err);
    }
  }

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
          netBalance={netBalance}
          expensesCount={expenseCount}
        />
      </div>

      <div className="cards col-3">
        <ToPay
          payList={payList}
          netBalance={netBalance}
          onConfirmSettlement={handleConfirmSettlement}
        />
      </div>

      <div className="cards col-3">
        <ToReceive
          receiveList={receiveList}
          netBalance={netBalance}
          onConfirmCollection={handleConfirmSettlement}
        />
      </div>

    

      <div className="cards col-12">
        <RecentActivity groups={groups} />
      </div>

      

      <div className="cards col-12">
        <InsightsCard />
      </div>
    </div>
  );
}

export default Dashboard;
