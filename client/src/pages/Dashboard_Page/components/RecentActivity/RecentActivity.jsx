import React from "react";
import { getRecentActivities } from "../../../../utils/getRecentActivities";
import "./Activites.css";
import EmptyState from "../../../../components/comman/EmptyState";
import { RiHistoryLine, RiMoneyRupeeCircleLine } from "@remixicon/react";

function RecentActivity({ groups, isLoading = false }) {
  const activities = getRecentActivities(groups);

  /* =========================
     LOADING SKELETON
  ========================== */
  if (isLoading) {
    return (
      <div className="recent-card">
        <div className="recent-header">
          <h3>Recent Activity</h3>
          <p>Across all groups</p>
        </div>
        <div className="recent-skeleton-body">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="recent-skeleton-row" />
          ))}
        </div>
      </div>
    );
  }

  /* =========================
     EMPTY STATE
  ========================== */
  if (activities.length === 0) {
    return (
      <div className="recent-card">
        <div className="recent-header">
          <h3>Recent Activity</h3>
          <p>Across all groups</p>
        </div>
        <EmptyState
          title="No activity yet"
          description="No recent expenses or activities in your groups yet."
          icon={<RiHistoryLine size={80} />}
        />
      </div>
    );
  }

  /* =========================
     ACTIVITIES LIST
  ========================== */
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
              <div className="recent-avatar-container">
                <div className="recent-avatar">
                  {item.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="recent-avatar-badge">
                  <RiMoneyRupeeCircleLine size={12} />
                </div>
              </div>

              <div className="recent-info">
                <p className="recent-title">
                  {item.name} added an expense for {item.title}
                </p>
                <span className="recent-sub">{item.groupName}</span>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="recent-right">
              <span className="recent-amount">₹{item.amount}</span>
              <span className="recent-date">
                {new Date(item.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;