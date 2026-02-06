import React from "react";
import "./GroupInfo.css";
import { RiArrowLeftCircleLine } from "@remixicon/react";

function GroupInfo({ group, onBack }) {
  if (!group) return null;

  return (
    <div className="group-info-panel">

      {/* HEADER */}
      <div className="group-info-header">
        <button className="group-info-back" onClick={onBack}>
          <RiArrowLeftCircleLine size={22} />
        </button>
        <h3>Group info</h3>
      </div>

      {/* SUMMARY */}
      <div className="group-info-summary">
        <div className="group-info-avatar">
          {group.name[0]}
        </div>

        <h2>{group.name}</h2>
        <p>{group.members.length} members</p>
      </div>

      {/* MEMBERS */}
      <div className="group-info-members">
        <h4>Members</h4>

        {group.members.map((m) => (
          <div key={m.id} className="group-info-member">
            <div className="member-avatar">
              {m.name[0]}
            </div>
            <span>{m.name}</span>
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="group-info-actions">
        <button className="mute-btn">Mute notifications</button>
        <button className="exit-btn">Exit group</button>
      </div>

    </div>
  );
}

export default GroupInfo;
