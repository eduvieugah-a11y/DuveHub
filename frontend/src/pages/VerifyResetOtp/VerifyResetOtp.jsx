import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api/config";

function VerifyResetOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next box automatically
    if (value && index < 3) {
      document
        .getElementById(`otp-${index + 1}`)
        ?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = sessionStorage.getItem("resetEmail");
    const otpCode = otp.join("");

    if (!email) {
      alert("Please start the password reset process again.");
      navigate("/forgot-password");
      return;
    }

    if (otpCode.length !== 4) {
      alert("Please enter the 4-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/verify-reset-otp`,
        {
          email,
          otp: otpCode,
        }
      );

      sessionStorage.setItem(
        "resetToken",
        response.data.resetToken
      );

      navigate("/reset-password");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to verify the code."
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

          <h2>Verify Your Email</h2>

          <p>
            Enter the 4-digit verification code sent
            to your email.
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "25px",
            }}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                style={{
                  width: "50px",
                  height: "55px",
                  textAlign: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Next"}
          </button>

          <button
            type="button"
            className="auth-switch"
            onClick={() => navigate("/forgot-password")}
          >
            Back
          </button>
        </form>

      </div>
    </section>
  );
}

export default VerifyResetOtp;