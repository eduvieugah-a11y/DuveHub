import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api/config";

function ResetPassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = sessionStorage.getItem("resetEmail");
    const resetToken = sessionStorage.getItem("resetToken");

    if (!email || !resetToken) {
      alert("Your password reset session has expired.");
      navigate("/forgot-password");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/reset-password`,
        {
          email,
          resetToken,
          newPassword,
          confirmPassword,
        }
      );

      alert(response.data.message);

      // Clear password reset information
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetToken");

      // Go back to login
      navigate("/login", { replace: true });

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to update password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register">
      <div className="register-container">

        <div className="register-header">
          <h1>DuvieHub</h1>

          <h2>Change Password</h2>

          <p>
            Create a new password for your account.
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          {/* New Password */}
          <div className="input-group">
            <label>New Password</label>

            <div className="password-box">
              <input
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="show-btn"
                onClick={() =>
                  setShowNewPassword(
                    !showNewPassword
                  )
                }
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>Confirm New Password</label>

            <div className="password-box">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="show-btn"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Password Updated"}
          </button>
        </form>

      </div>
    </section>
  );
}

export default ResetPassword;