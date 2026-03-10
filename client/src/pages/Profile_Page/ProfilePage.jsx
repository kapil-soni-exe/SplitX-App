import React, { useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import ProfileActions from "./components/ProfileActions";
import Model from "../../components/comman/Model"
import EditProfileForm from "./components/EditProfileForm";
import "./ProfilePage.css";

function ProfilePage() {
  const [openEdit, setOpenEdit] = useState(false);
  return (
    <div className="profile-page">
      <ProfileHeader  onEditClick={() => setOpenEdit(true)} />
        <Model
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
      >
        <EditProfileForm onClose={() => setOpenEdit(false)} />
      </Model>
      <ProfileStats />
      <ProfileActions />
    </div>
  );
}

export default ProfilePage;
