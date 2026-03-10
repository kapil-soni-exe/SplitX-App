import React from "react";
import { useAuth } from "../../../context/AuthContext";

export default function ProfileHeader({ onEditClick }) {
  const {user} = useAuth()

  if (!user) return null;


  const firstLetter = user?.name?.charAt(0).toUpperCase();

  return (
    <div className="profile-header">

      <div className="profile-left">

        <div className="profile-avatar">
          {firstLetter}
        </div>

        <div className="profile-info">
          <h2 className="profile-name">
            {user?.name}
          </h2>

          <p className="profile-email">
            {user?.email}
          </p>
        </div>

      </div>

      <button className="edit-profile-btn" onClick={onEditClick}>
        Edit Profile
      </button>

    </div>
  );
}