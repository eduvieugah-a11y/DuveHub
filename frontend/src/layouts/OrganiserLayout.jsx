import OrganiserSidebar from "../components/Organiser/OrganiserSidebar";
import AdminNavbar from "../components/Admin/AdminNavbar";
import "./AdminLayout.css";

function OrganiserLayout({ children }) {
  return (
    <div className="admin-layout">

      <OrganiserSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <div className="admin-content">
          {children}
        </div>

      </div>

    </div>
  );
}

export default OrganiserLayout;