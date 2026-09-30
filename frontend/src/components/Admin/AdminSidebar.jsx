import "./AdminSidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  Ticket,
  Users,
  Settings,
  LogOut,
  Crown,
  House,
} from "lucide-react";

function AdminSidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <aside className="admin-sidebar">

      <h2>DuvieHub</h2>

      <NavLink to="/">
        <House size={20}/>
        Home 
      </NavLink>

      <NavLink to="/admin">
        <LayoutDashboard size={20} />
        Dashboard
      </NavLink>

      {/* ORGANISER MENU */}
      {user?.role === "organiser" && (
        <>
          <NavLink to="/admin/create-event">
            <PlusCircle size={20} />
            Create Event
          </NavLink>

          <NavLink to="/admin/events">
            <CalendarDays size={20} />
            My Events
          </NavLink>

          <NavLink to="/premium">
            <Crown size={20} />
            Premium
          </NavLink>

          <NavLink to="/admin/bookings">
            <Ticket size={20} />
            Ticket Sales
          </NavLink>
        </>
      )}

      {/* ADMIN MENU */}
      {user?.role === "admin" && (
        <>
          <NavLink to="/admin/create-event">
            <PlusCircle size={20} />
            Create Event
          </NavLink>
          
          <NavLink to="/admin/events">
            <CalendarDays size={20} />
            All Events
          </NavLink>

          <NavLink to="/admin/users">
            <Users size={20} />
            Users
          </NavLink>

          <NavLink to="/admin/organiser-applications">
            <Users size={20} />
            Organiser Applications
          </NavLink>
        </>
      )}

      <NavLink to="/admin/settings">
        <Settings size={20} />
        Settings
      </NavLink>

      {/* LOGOUT */}
      <button
        className="sidebar-logout"
        onClick={handleLogout}
      >
        <LogOut size={20} />
        Logout
      </button>

    </aside>
  );
}

export default AdminSidebar;