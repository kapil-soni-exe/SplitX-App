import React from 'react'
import "./InviteCheck.css"
import {useParams,useNavigate, redirect} from "react-router-dom"
import {useGroupManager} from "../../../../hooks/useGroupManager"
import {useAuth} from "../../../../context/AuthContext"
import { CheckInviteCode,joinGroupByInvite } from '../../../../../api/group.api'
import { useState,useEffect } from 'react'
import Button from "../../../../components/comman/Button"

function InviteCheck() {
    const{inviteCode}= useParams()
    const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
const { user } = useAuth();
const { addGroup } = useGroupManager();

const [joining, setJoining] = useState(false);


const handleJoin = async () => {
  //  login guard
  if (!user) {
    navigate("/login",{
      state:{
        redirectTo:`/invite/${inviteCode}`
      }
    });
    return;
  }

  try {
    setJoining(true);

    const res = await joinGroupByInvite(inviteCode);

    //  add group to global state
    addGroup(res.data.data);

    // redirect to groups page
    navigate("/groups");
  } catch (err) {
    setError("Failed to join group");
  } finally {
    setJoining(false);
  }
};


  useEffect(() => {
    const check = async () => {
      try {
        const res = await CheckInviteCode(inviteCode);
        setGroup(res.data.data);
      } catch {
        setError("Invalid or expired invite link");
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [inviteCode]);

   if (loading) {
    return <div className="invite-status">Checking invite link…</div>;
  }

  if (error) {
    return <div className="invite-error">{error}</div>;
  }
  return (
    <div className="invite-container">
  <div className="invite-card">
    <div className="invite-icon">S</div>

    <p className="invite-title">Group Invite</p>
    <p className="invite-subtitle">
      You’ve been invited to join a group
    </p>

    <p className="invite-group-name">{group.name}</p>
    <p className="invite-members">
      {group.membersCount} participants
    </p>

   <Button className="invite-join-btn"
   onClick={handleJoin}
   disabled={joining}
   >{joining ? "Joining..." : "Join Group"}</Button>
  </div>
</div>
  
  )
}

export default InviteCheck