import React from 'react'
import { getRecentActivities } from '../../../../utils/getRecentActivities'
import "./Activites.css"

function RecentActivity({groups}) {

const activities = getRecentActivities(groups)
// console.log("groups:", groups);


  console.log(activities)
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