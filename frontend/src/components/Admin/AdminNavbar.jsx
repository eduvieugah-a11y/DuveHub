import "./AdminNavbar.css";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api/config";

function AdminNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const title =
    user?.role === "organiser"
      ? "Organiser Dashboard"
      : "Admin Dashboard";

  // ==========================================
  // PROFILE
  // ==========================================

  const goToProfile = () => {
    navigate("/admin/profile");
  };

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user?._id) return;

        let eventsResponse;
        let bookingsResponse;

        // ==========================================
        // FETCH EVENTS + BOOKINGS
        // ==========================================

        if (user.role === "organiser") {
          eventsResponse = await axios.get(
            `${API_URL}/api/events/organiser/${user._id}`
          );

          bookingsResponse = await axios.get(
            `${API_URL}/api/bookings/organiser/${user._id}`
          );
        } else if (user.role === "admin") {
          eventsResponse = await axios.get(
            `${API_URL}/api/events`
          );

          bookingsResponse = await axios.get(
            `${API_URL}/api/events`
          );
        }

        // ==========================================
        // SEARCH DATA
        // ==========================================

        const events = eventsResponse?.data || [];
        const bookings = bookingsResponse?.data || [];

        const eventResults = events.map((event) => ({
          type: "event",
          title: event.title,
          subtitle: event.location || "Event",
          id: event._id,
          path: `/admin/edit-event/${event._id}`,
        }));

        const bookingResults = bookings.map((booking) => ({
          type: "booking",
          title: booking.eventTitle,
          subtitle: `${booking.name} • ${booking.tickets} ticket(s)`,
          id: booking._id,
          path: "/admin/bookings",
        }));

        setSearchResults([
          ...eventResults,
          ...bookingResults,
        ]);

      } catch (error) {
        console.error(
          "Dashboard navbar error:",
          error
        );
      }
    };

    fetchDashboardData();
  }, [user?._id, user?.role]);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredResults = searchResults.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.title
        ?.toLowerCase()
        .includes(searchText) ||
      item.subtitle
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);

    if (value.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearchResult = (path) => {
    navigate(path);

    setSearch("");
    setShowSearchResults(false);
  };

  const clearSearch = () => {
    setSearch("");
    setShowSearchResults(false);
  };

  return (
    <header className="admin-navbar">

      {/* ==================================
          LEFT
      ================================== */}

      <div className="admin-navbar-heading">

        <h2>{title}</h2>

        <p>
          Welcome back, {user?.name || "User"}
        </p>

      </div>

      <div className="admin-navbar-right">

        <div className="search-wrapper">

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search events or bookings..."
              value={search}
              onChange={handleSearchChange}
              onFocus={() => {
                if (search.trim()) {
                  setShowSearchResults(true);
                }
              }}
            />

            {search && (
              <button
                className="clear-search"
                onClick={clearSearch}
                type="button"
              >
                <X size={16} />
              </button>
            )}

          </div>

          {/* SEARCH RESULTS */}

          {showSearchResults && (
            <div className="search-results">

              {filteredResults.length > 0 ? (
                filteredResults
                  .slice(0, 8)
                  .map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      className="search-result-item"
                      onClick={() =>
                        handleSearchResult(item.path)
                      }
                      type="button"
                    >

                      <div className="search-result-icon">
                        {item.type === "event"
                          ? "📅"
                          : "🎟️"}
                      </div>

                      <div>

                        <strong>
                          {item.title}
                        </strong>

                        <p>
                          {item.subtitle}
                        </p>

                      </div>

                    </button>
                  ))
              ) : (
                <div className="no-search-results">

                  <Search size={20} />

                  <p>
                    No results found
                  </p>

                </div>
              )}

            </div>
          )}

        </div>

        {/* ==================================
            PROFILE
        ================================== */}

        <button
          className="admin-profile"
          onClick={goToProfile}
          type="button"
          aria-label="Open profile"
        >

          <div className="avatar">
            {user?.name
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <h4>
              {user?.name}
            </h4>

            <p>
              {user?.role === "organiser"
                ? "Organiser"
                : user?.role === "admin"
                ? "Administrator"
                : "User"}
            </p>

          </div>

        </button>

      </div>

    </header>
  );
}

export default AdminNavbar;