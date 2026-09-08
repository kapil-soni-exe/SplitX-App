import React from "react";
import "./GroupInfo.css";
import { RiArrowLeftCircleLine } from "@remixicon/react";
import { useGroupDetail } from "../../../../hooks/useGroupDetail";
import InviteSuccess from "../GroupList/InviteLink";
import { leaveGroup } from "../../../../../api/group.api";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../../../components/comman/ConfirmModel";
import { useState } from "react";
import Spinner from "../../../../components/Loaders/Spinner";

function GroupInfo({ groupId, onBack, onGroupLeft, onCloseChat }) {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [error, setError] = useState(null);
  const { group, loading } = useGroupDetail(groupId);

  /**
   * Check if member is admin
   * Now member object contains userId
   */
  const isAdmin = (memberId) => {
    if (!group) return false;
    const adminId = group.admin?._id || group.admin;
    return memberId?.toString() === adminId?.toString();
  };

  const handleExitGroup = async () => {
    setError(null);
    try {
      await leaveGroup(groupId);
      setShowLeaveModal(false);
      await onGroupLeft();  // wait for cache invalidation before closing panels
      onCloseChat();
      onBack();
    } catch (err) {
      console.error("Leave group failed", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to leave group. Please settle all balances first.";
      setError(message);
    }
  };

  if (loading) {
    return <Spinner />;
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
          inviteLink={`${window.location.origin}/invite/${group.inviteCode}`}
          subtitle={null}
        />
      </div>

      {/* MEMBERS */}
      <div className="group-info-members">
        <div className="members-header">Members</div>

        <div className="members-scroll">
          {group.members.map((member) => {
            const user = member.userId; // new structure

            if (!user) return null;

            return (
              <div key={user._id} className="group-info-member">
                <div className="member-avatar">{user.name?.[0]}</div>

                <div className="member-info">
                  <span className="member-name">{user.name}</span>

                  {isAdmin(user._id) && (
                    <span className="admin-badge">Admin</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="group-info-actions">
        <button className="mute-btn">Mute notifications</button>
        <button
          className="exit-btn"
          onClick={() => {
            setError(null);
            setShowLeaveModal(true);
          }}
        >
          Exit group
        </button>
      </div>
      <ConfirmModal
        isOpen={showLeaveModal}
        title="Leave Group"
        description={error || "Are you sure you want to leave this group?"}
        confirmText="Leave"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleExitGroup}
        onCancel={() => {
          setShowLeaveModal(false);
          setError(null);
        }}
      />
    </div>
  );
}

export default GroupInfo;