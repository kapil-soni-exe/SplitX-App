import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { updateProfile } from "../../../../api/profile.api";
import "./EditProfileForm.css"

function EditProfileForm({ onClose }) {
  
const {user,setUser}=useAuth()
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setLoading(true);

      const res = await updateProfile({ name });

      setUser(res.data.user); // update context

      onClose(); // close modal
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      <h2>Edit Profile</h2>

      {/* Name */}
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      {/* Email (readonly) */}
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={user?.email}
          disabled
        />
      </div>

      {/* Buttons */}
      <div className="form-actions">
        <button type="button" onClick={onClose}>
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || name === user?.name}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

export default EditProfileForm;