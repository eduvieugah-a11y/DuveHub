import "./AdminSettings.css";
import { useState } from "react";

function AdminSettings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const savedSettings = JSON.parse(
    localStorage.getItem("duviehubSettings")
  );

  const [emailNotifications, setEmailNotifications] = useState(
    savedSettings?.emailNotifications ?? true
  );

  const [bookingNotifications, setBookingNotifications] = useState(
    savedSettings?.bookingNotifications ?? true
  );

  const [eventReminders, setEventReminders] = useState(
    savedSettings?.eventReminders ?? true
  );

  const handleSave = () => {
    const settings = {
      emailNotifications,
      bookingNotifications,
      eventReminders,
    };

    localStorage.setItem(
      "duviehubSettings",
      JSON.stringify(settings)
    );

    alert("Settings saved successfully! 🎉");
  };

  const handleReset = () => {
    const defaultSettings = {
      emailNotifications: true,
      bookingNotifications: true,
      eventReminders: true,
    };

    setEmailNotifications(true);
    setBookingNotifications(true);
    setEventReminders(true);

    localStorage.setItem(
      "duviehubSettings",
      JSON.stringify(defaultSettings)
    );

    alert("Settings have been reset.");
  };

  return (
    <div className="admin-settings">

      <div className="settings-header">
        <h1>Settings</h1>

        <p>
          Manage your DuvieHub dashboard preferences.
        </p>
      </div>

      {/* ACCOUNT */}
      <div className="settings-card">

        <h2>Account</h2>

        <div className="account-info">
          <div className="settings-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <span>
              {user?.role === "organiser"
                ? "Organiser"
                : "Administrator"}
            </span>
          </div>
        </div>

      </div>

      {/* NOTIFICATIONS */}
      <div className="settings-card">

        <h2>Notifications</h2>

        <div className="setting-item">

          <div>
            <h3>Email Notifications</h3>

            <p>
              Receive important DuvieHub updates by email.
            </p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) =>
                setEmailNotifications(e.target.checked)
              }
            />

            <span className="slider"></span>
          </label>

        </div>

        <div className="setting-item">

          <div>
            <h3>Booking Notifications</h3>

            <p>
              Get notified when someone books your event.
            </p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={bookingNotifications}
              onChange={(e) =>
                setBookingNotifications(e.target.checked)
              }
            />

            <span className="slider"></span>
          </label>

        </div>

        <div className="setting-item">

          <div>
            <h3>Event Reminders</h3>

            <p>
              Receive reminders about upcoming events.
            </p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={eventReminders}
              onChange={(e) =>
                setEventReminders(e.target.checked)
              }
            />

            <span className="slider"></span>
          </label>

        </div>

      </div>

      {/* ACTIONS */}
      <div className="settings-actions">

        <button
          className="reset-settings"
          onClick={handleReset}
        >
          Reset
        </button>

        <button
          className="save-settings"
          onClick={handleSave}
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}

export default AdminSettings;