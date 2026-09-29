import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../api/config";

function RegisterForm({switchToLogin}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value,
      });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Check if passwords match
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }
    );

    alert(response.data.message);

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    switchToLogin();

  } catch (error) {
    alert(
      error.response?.data?.message || "Registration failed"
    );
  }
};

  return (
    <>

      <div className="register-header">

        <h1>DuvieHub</h1>

        <h2>Create Your Account</h2>

        <p>
          Join thousands of event lovers across Nigeria.
        </p>

      </div>

      <form className="register-form" onSubmit={handleSubmit}>

        <div className="input-group">
          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

        </div>

        <div className="input-group">

          <label>Password</label>

          <div className="password-box">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="button"
              className="show-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

        </div>

        <div className="input-group">

          <label>Confirm Password</label>

          <div className="password-box">

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="button"
              className="show-btn"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>

          </div>

        </div>

        <div className="terms">

          <input
            type="checkbox"
            id="terms"
          />

          <label htmlFor="terms">
            I agree to the Terms & Conditions
          </label>

        </div>

        <button type="submit" className="register-btn">
          Create Account
        </button>

        <p className="login-text">

          Already have an account?

          <button type="button" className="auth-switch" onClick={switchToLogin}>
            Login
          </button>


        </p>

      </form>

    </>
  );
}

export default RegisterForm;