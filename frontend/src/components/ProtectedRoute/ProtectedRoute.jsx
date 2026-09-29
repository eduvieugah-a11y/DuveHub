import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==========================================
  // ROLE NOT ALLOWED
  // ==========================================

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {

    // If this route has a custom redirect,
    // use it first.
    if (redirectTo) {
      return (
        <Navigate
          to={redirectTo}
          replace
        />
      );
    }

    // Admin
    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    // Organiser
    if (user.role === "organiser") {
      return (
        <Navigate
          to="/organiser"
          replace
        />
      );
    }

    // Normal user
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;