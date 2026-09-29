import "./AdminProfile.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api/config";

function AdminProfile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.put(
        `${API_URL}/api/auth/profile/${user._id}`,
        {
          name,
          email,
        }
      );

      // Update localStorage with the new information
      const updatedUser = {
        ...user,
        name: res.data.user.name,
        email: res.data.user.email,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      alert("Profile updated successfully! 🎉");

      navigate("/admin/profile");

      window.location.reload();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-profile-page">

      <div className="profile-header">
        <h1>My Profile</h1>

        <p>
          Manage your personal information.
        </p>
      </div>

      <div className="profile-card">

        <div className="profile-avatar">
          {name?.charAt(0).toUpperCase()}
        </div>

        <h2>{name}</h2>

        <p className="profile-role">
          {user?.role === "organiser"
            ? "Organiser"
            : "Administrator"}
        </p>

        <form onSubmit={handleUpdate}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminProfile;