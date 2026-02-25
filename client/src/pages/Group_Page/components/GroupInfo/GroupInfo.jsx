import React from "react";
import "./GroupInfo.css";
import { RiArrowLeftCircleLine } from "@remixicon/react";
import { useGroupDetail } from "../../../../hooks/useGroupDetail";
import InviteSuccess from "../GroupList/InviteLink";

function GroupInfo({ groupId, onBack }) {
  const { group, loading } = useGroupDetail(groupId);

  // Admin Check
  const isAdmin = (memberId) => {
    return (
    memberId?.toString() === group.createdBy?._id?.toString()
  );
  };

  
  if (loading) {
    return <div className="group-loading">Loading group info…</div>;
  }

  if (!group) {
    return <div className="group-info-empty">Group not found</div>;
  }

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
        <div className="group-info-avatar">{group.name[0]}</div>

        <h2>{group.name}</h2>
        <p>{group.members.length} members</p>
        <InviteSuccess
          inviteLink={`${window.location.origin}/join/${group.inviteCode}`}
        />
      </div>

      {/* MEMBERS */}
      <div className="group-info-members">
        <div className="members-header">Members</div>
        <div className="members-scroll">
          {group.members.map((m) => (
            <div key={m._id} className="group-info-member">
              <div className="member-avatar">{m.name[0]}</div>
              <div className="member-info">
                <span className="member-name">{m.name}</span>

                {isAdmin(m._id) && <span className="admin-badge">Admin</span>}
              </div>
            </div>
          ))}
        </div>
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
