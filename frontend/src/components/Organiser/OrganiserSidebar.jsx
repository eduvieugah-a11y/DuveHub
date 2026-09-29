import "../Admin/AdminSidebar.css";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  Ticket,
  CreditCard,
  Settings,
  LogOut,
  House,
} from "lucide-react";

function OrganiserSidebar() {
  return (
    <aside className="admin-sidebar">

      <h2>DuvieHub</h2>

      {/* HOME */}
      <NavLink to="/">
        <House size={20} />
        Home
      </NavLink>

      {/* DASHBOARD */}
      <NavLink to="/organiser">
        <LayoutDashboard size={20} />
        Dashboard
      </NavLink>

      {/* CREATE EVENT */}
      <NavLink to="/admin/create-event">
        <PlusCircle size={20} />
        Create Event
      </NavLink>

      {/* MY EVENTS */}
      <NavLink to="/admin/events">
        <CalendarDays size={20} />
        My Events
      </NavLink>

      {/* TICKET SALES */}
      <NavLink to="/admin/bookings">
        <Ticket size={20} />
        Ticket Sales
      </NavLink>

      {/* PREMIUM */}
      <NavLink to="/premium">
        <CreditCard size={20} />
        Premium Plan
      </NavLink>

      {/* SETTINGS */}
      <NavLink to="/admin/settings">
        <Settings size={20} />
        Settings
      </NavLink>

      {/* LOGOUT */}
      <NavLink to="/">
        <LogOut size={20} />
        Logout
      </NavLink>

    </aside>
  );
}

export default OrganiserSidebar;