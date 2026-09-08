import React, { useState, useEffect } from "react";
import "./InviteCheck.css";
import { useParams, useNavigate } from "react-router-dom";
import { useGroupManager } from "../../../../hooks/useGroupManager";
import { useAuth } from "../../../../context/AuthContext";
import { CheckInviteCode, joinGroupByInvite } from "../../../../../api/group.api";
import Button from "../../../../components/comman/Button";
import Spinner from "../../../../components/Loaders/Spinner";
import { RiErrorWarningLine } from "@remixicon/react";

function InviteCheck() {
  const { inviteCode } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();
  const { addGroup } = useGroupManager();

  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    // Login guard
    if (!user) {
      navigate("/login", {
        state: {
          redirectTo: `/invite/${inviteCode}`,
        },
      });
      return;
    }

    try {
      setJoining(true);
      setError("");

      const res = await joinGroupByInvite(inviteCode);

      // Add group to global state
      addGroup(res.data.data);

      // Redirect to groups page
      navigate("/groups");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to join group";
      setError(message);
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    const check = async () => {
      try {
        const res = await CheckInviteCode(inviteCode);
        setGroup(res.data.data);
      } catch (err) {
        const message =
          err.response?.data?.message || "Invalid or expired invite link";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [inviteCode]);

  /* =========================
     LOADING STATE (Card Container)
  ========================== */
  if (loading) {
    return (
      <div className="invite-container">
        <div className="invite-card invite-loading-card">
          <Spinner />
          <p className="invite-status-text">Checking invite link…</p>
        </div>
      </div>
    );
  }

  /* =========================
     ERROR STATE (Card Container)
  ========================== */
  if (error && !group) {
    return (
      <div className="invite-container">
        <div className="invite-card invite-error-card">
          <div className="invite-error-icon">
            <RiErrorWarningLine size={40} />
          </div>
          <h3 className="invite-error-title">Invite Link Error</h3>
          <p className="invite-error-text">{error}</p>
          <Button
            className="invite-back-btn"
            text="Go to Home"
            onClick={() => navigate("/")}
          />
        </div>
      </div>
    );
  }

  const groupInitial = group?.name ? group.name.charAt(0).toUpperCase() : "G";
  const displayCount = Math.min(group?.membersCount || 1, 4);

  return (
    <div className="invite-container">
      <div className="invite-card">
        {/* INVITED BADGE */}
        <div className="invite-pill-badge">YOU'RE INVITED</div>

        {/* GROUP AVATAR */}
        <div className="invite-avatar">{groupInitial}</div>

        <p className="invite-subtitle">You’ve been invited to join</p>

        {/* GROUP NAME */}
        <h2 className="invite-group-name">{group?.name}</h2>

        {/* MEMBER AVATAR STACK */}
        <div className="invite-members-section">
          <div className="member-avatar-stack">
            {Array.from({ length: displayCount }).map((_, index) => (
              <div key={index} className="stack-avatar">
                {String.fromCharCode(65 + index)}
              </div>
            ))}
            {(group?.membersCount || 0) > 4 && (
              <div className="stack-more">
                +{(group?.membersCount || 0) - 4}
              </div>
            )}
          </div>
          <p className="invite-members-text">
            {group?.membersCount || 0}{" "}
            {group?.membersCount === 1 ? "participant" : "participants"}
          </p>
        </div>

        {error && <p className="invite-join-error">{error}</p>}

        <Button
          className="invite-join-btn"
          onClick={handleJoin}
          disabled={joining}
        >
          {joining ? "Joining..." : "Join Group"}
        </Button>
      </div>
    </div>
  );
}

export default InviteCheck;