import "./PremiumPlans.css";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../api/config";

function PremiumPlans() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const savedUser = JSON.parse(
          localStorage.getItem("user")
        );

        if (!savedUser) {
          setLoading(false);
          return;
        }

        const userId = savedUser._id || savedUser.id;

        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/users/${userId}`
        );

        const freshUser = response.data.user;

        // Update localStorage with the latest database data
        localStorage.setItem(
          "user",
          JSON.stringify(freshUser)
        );

        // Update the page
        setUser(freshUser);
      } catch (error) {
        console.error(
          "Error getting user:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpgrade = async () => {
    try {
      if (!user) {
        alert("Please login first.");
        return;
      }

      const userId = user._id || user.id;

      if (!userId) {
        alert("User information is missing. Please login again.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/payment/initialize`,
        {
          email: user.email,
          userId,
          paymentType: "premium",
        }
      );

      const authorizationUrl =
        response.data.authorization_url;

      if (!authorizationUrl) {
        alert("Unable to start payment.");
        return;
      }

      window.location.href = authorizationUrl;
    } catch (error) {
      console.error(
        "Premium payment error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to start payment."
      );
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <section className="premium-page">
          <h2>Loading your plan...</h2>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="premium-page">
        <div className="premium-header">
          <h1>Choose Your Plan</h1>

          <p>
            Upgrade your organiser account and unlock more
            powerful features.
          </p>
        </div>

        <div className="plans">
          {/* FREE PLAN */}
          <div className="plan-card free">
            <h2>Free</h2>

            <h3>₦0</h3>

            <ul>
              <li>✔ Up to 50 Tickets Per Event</li>
              <li>✔ Basic Dashboard</li>
              <li>✔ Basic Analytics</li>
              <li>✔ Standard Support</li>
            </ul>

            <button type="button" disabled>
              {user?.plan === "premium"
                ? "Available"
                : "Current Plan"}
            </button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="plan-card premium">
            <h2>Premium</h2>

            <h3>₦10,000 / Month</h3>

            <ul>
              <li>✔ More Than 50 Tickets Per Event</li>
              <li>✔ Unlimited Events</li>
              <li>✔ Advanced Analytics</li>
              <li>✔ Priority Support</li>
              <li>✔ Featured Events</li>
              <li>✔ Early Access Features</li>
            </ul>

            <button
              type="button"
              onClick={handleUpgrade}
              disabled={user?.plan === "premium"}
            >
              {user?.plan === "premium"
                ? "Premium Active"
                : "Upgrade to Premium"}
            </button>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default PremiumPlans;