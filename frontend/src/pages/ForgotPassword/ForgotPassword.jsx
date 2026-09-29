import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api/config";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `${API_URL}/api/auth/forgot-password`,
        { email }
      );

      // Save the email temporarily so the OTP page can use it
      sessionStorage.setItem("resetEmail", email);

      navigate("/verify-reset-otp");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to send verification code."
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

          <h2>Forgot Password?</h2>

          <p>
            Enter the email you used to register.
          </p>

          <small>
            A verification code will be sent to this email.
          </small>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? "Sending..." : "Next"}
          </button>

          <button
            type="button"
            className="auth-switch"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </form>

      </div>
    </section>
  );
}

export default ForgotPassword;