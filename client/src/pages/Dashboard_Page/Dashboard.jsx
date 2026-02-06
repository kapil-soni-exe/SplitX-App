import React, { useState } from "react";
import "./dashboard.css";
import ToPay from "./components/To_Pay/ToPay";
import ToReceive from "./components/To_Receive/ToReceive";
import ButtonAction from "./components/ButtonAction";
import RecentActivity from "./components/RecentActivity/RecentActivity";
import GroupSnapshot from "./components/GroupSnapshot";
import InsightsCard from "./components/InsightsCard";
import GroupSummary from "./components/GroupSummary/GroupSummary";
import { groups } from "../../data/mockData";
function Dashboard() {
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0].id);

  const selectedGroup = groups.find((group)=>{
     return group.id===selectedGroupId
  })
  // console.log(selectedGroup)
  return (
    <div className="dashboard-grid">
      <div className="cards hero-cards col-6">
        <GroupSummary groups={selectedGroup} currentUserId="u1" />
      </div>
      <div className=" cards col-3">
        <ToPay groups={selectedGroup} currentUserId="u2"/>
      </div>

      <div className=" cards col-3">
        <ToReceive groups={selectedGroup} currentUserId="u1"/>
      </div>

      <div className=" col-12">
        <ButtonAction />
      </div>
      <div className="cards col-12">
        <RecentActivity groups={groups} />
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
