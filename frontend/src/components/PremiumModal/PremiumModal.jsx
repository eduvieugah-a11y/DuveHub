import "./PremiumModal.css";

function PremiumModal({ open, onClose, onUpgrade }) {
  if (!open) return null;

  return (
    <div className="premium-overlay">
      <div className="premium-modal">
        <h2>⭐ Upgrade to Premium</h2>

        <p>
          Your Free Plan allows only
          <strong> 50 tickets per event.</strong>
        </p>

        <div className="premium-features">
          <p>✅ More Than 50 Tickets Per Event</p>
          <p>✅ Featured Events</p>
          <p>✅ Advanced Analytics</p>
          <p>✅ Priority Support</p>
        </div>

        <div className="premium-buttons">
          <button
            className="upgrade-btn"
            onClick={onUpgrade}
          >
            Upgrade Now
          </button>

          <button
            className="later-btn"
            onClick={onClose}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default PremiumModal;