import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../api/config";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("error");
        setMessage("Payment reference was not found.");
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/payment/verify/${reference}`
        );

        if (
          response.data.status === "success" &&
          response.data.paymentType === "premium" &&
          response.data.plan === "premium"
        ) {
          const currentUser = JSON.parse(
            localStorage.getItem("user")
          );

          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              plan: "premium",
              premiumExpires: response.data.premiumExpires,
            };

            localStorage.setItem(
              "user",
              JSON.stringify(updatedUser)
            );
          }

          setStatus("success");
          setMessage("Your Premium plan is now active!");

          setTimeout(() => {
            navigate("/organiser");
          }, 2000);
        } else {
          setStatus("error");
          setMessage("Payment could not be verified.");
        }
      } catch (error) {
        console.error(
          "Payment verification error:",
          error.response?.data || error.message
        );

        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Unable to verify your payment."
        );
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div>
        {status === "verifying" && (
          <>
            <h1>Verifying Payment...</h1>
            <p>{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1>🎉 Premium Activated!</h1>
            <p>{message}</p>
            <p>
              Redirecting to your organiser dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1>Payment Verification Failed</h1>
            <p>{message}</p>

            <button
              onClick={() => navigate("/premium")}
              style={{
                marginTop: "20px",
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Back to Premium Plans
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentSuccess;