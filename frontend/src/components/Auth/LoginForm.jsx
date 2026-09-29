import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api/config";

function LoginForm({ switchToRegister, onLoginSuccess }) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        formData
      );

      // Save the logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      axios.defaults.headers.common.Authorization =
      `Bearer ${response.data.token}`;

      alert(response.data.message);

      // Close the login drawer
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Automatically go to Home
      navigate("/", { replace: true });

    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <>
      <div className="register-header">
        <h1>DuvieHub</h1>

        <h2>Welcome Back</h2>

        <p>
          Login to continue booking amazing events.
        </p>
      </div>

      <form
        className="register-form"
        onSubmit={handleSubmit}
      >
        <div className="input-group">
          <label>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="show-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <label>
            <input type="checkbox" />
            {" "}Remember Me
          </label>

          <button
            type="button"
            className="auth-switch"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="register-btn"
        >
          Login
        </button>

        <p className="login-text">
          Don't have an account?

          <button
            type="button"
            className="auth-switch"
            onClick={switchToRegister}
          >
            Sign Up
          </button>
        </p>
      </form>
    </>
  );
}

export default LoginForm;
