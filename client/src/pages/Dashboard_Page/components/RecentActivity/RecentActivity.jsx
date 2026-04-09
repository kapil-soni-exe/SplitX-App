import React from 'react'
import { getRecentActivities } from '../../../../utils/getRecentActivities'
import "./Activites.css"
import EmptyState from "../../../../components/comman/EmptyState";
import { RiHistoryLine } from "@remixicon/react";

function RecentActivity({ groups }) {
  const activities = getRecentActivities(groups);

  if (activities.length === 0) {
    return (
      <div className="recent-card">
        <div className="recent-header">
          <h3>Recent Activity</h3>
          <p>Across all groups</p>
        </div>
        <EmptyState
          title="No activity yet"
          description="Tumbleweeds... No recent expenses or activities found in your groups."
          icon={<RiHistoryLine size={80} />}
        />
      </div>
    );
  }

  return (
    <div className="recent-card">
      <div className="recent-header">
        <h3>Recent Activity</h3>
        <p>Across all groups</p>
      </div>
      <div className="recent-body">
        {activities.map((item) => (
    <div key={item.id} className="recent-row">
      {/* LEFT SIDE */}
      <div className="recent-left">
        <div className="recent-avatar">
          {item.name[0].toUpperCase()}
        </div>

        <div className="recent-info">
          <p className="recent-title">
            {item.name} added ₹{item.amount} for {item.title}
          </p>

          <span className="recent-sub">
            {item.groupName}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="recent-right">
        <span className="recent-amount">
          ₹{item.amount}
        </span>

        <span className="recent-date">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  ))}
      </div>
    </div>
  )
}

export default RecentActivity