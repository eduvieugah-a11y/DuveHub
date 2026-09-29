import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import AuthDrawer from "../AuthDrawer/AuthDrawer";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerView, setDrawerView] = useState("register");

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("user");

    setMenuOpen(false);

    navigate("/login", { replace: true });
  };

  // =========================
  // DASHBOARD REDIRECT
  // =========================
  const goToDashboard = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "organiser") {
      navigate("/organiser");
    } else {
      navigate("/dashboard");
    }

    setMenuOpen(false);
  };

  // =========================
  // PROFILE REDIRECT
  // =========================
  const goToProfile = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (
      user.role === "admin" ||
      user.role === "organiser"
    ) {
      navigate("/admin/profile");
    } else {
      navigate("/dashboard");
    }

    setMenuOpen(false);
  };

  const openLogin = () => {
    setDrawerView("login");
    setOpenDrawer(true);
    setMenuOpen(false);
  };

  const openRegister = () => {
    setDrawerView("register");
    setOpenDrawer(true);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">

        <h1 className="logo">DuvieHub</h1>

        <div
          className="menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul
          className={
            menuOpen
              ? "nav-links active"
              : "nav-links"
          }
        >

          <li>
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/events"
              onClick={() => setMenuOpen(false)}
            >
              Events
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
            >
              About
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </NavLink>
          </li>

          {/* MOBILE BUTTONS */}
          <div className="mobile-buttons">

            {user ? (
              <>
                <button
                  className="login-btn"
                  onClick={goToProfile}
                >
                  Profile
                </button>

                <button
                  className="login-btn"
                  onClick={goToDashboard}
                >
                  Dashboard
                </button>

                <button
                  className="signup-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="login-btn"
                  onClick={openLogin}
                >
                  Login
                </button>

                <button
                  className="signup-btn"
                  onClick={openRegister}
                >
                  Sign Up
                </button>
              </>
            )}

          </div>

        </ul>

        {/* DESKTOP BUTTONS */}
        <div className="nav-buttons">

          {user ? (
            <>
              {/* PROFILE BUTTON */}
              <button
                className="user-name-btn"
                onClick={goToProfile}
              >
                👤 Hi, {user.name}
              </button>

              {/* DASHBOARD */}
              <button
                className="login-btn"
                onClick={goToDashboard}
              >
                Dashboard
              </button>

              {/* LOGOUT */}
              <button
                className="signup-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="login-btn"
                onClick={openLogin}
              >
                Login
              </button>

              <button
                className="signup-btn"
                onClick={openRegister}
              >
                Sign Up
              </button>
            </>
          )}

        </div>

      </nav>

      <AuthDrawer
        isOpen={openDrawer}
        onClose={() => setOpenDrawer(false)}
        defaultView={drawerView}
      />

    </>
  );
}

export default Navbar;