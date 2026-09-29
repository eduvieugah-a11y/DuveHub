import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import EventDetails from "./pages/EventDetails/EventDetails";
import Booking from "./pages/Booking/Booking";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import VerifyResetOtp from "./pages/VerifyResetOtp/VerifyResetOtp";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
// import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateEvent from "./pages/Admin/CreateEvent";
import AdminEvents from "./pages/Admin/AdminEvents";
import EditEvent from "./pages/Admin/EditEvent";
import AdminBookings from "./pages/Admin/AdminBookings";
import AdminUsers from "./pages/Admin/AdminUsers";
import BecomeOrganiser from "./pages/BecomeOrganiser/BecomeOrganiser";
import AdminOrganiserApplications from "./pages/AdminOrganiserApplications/AdminOrganiserApplications";
import PremiumPlans from "./pages/PremiumPlans/PremiumPlans";
import OrganiserDashboard from "./pages/Organiser/OrganiserDashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminProfile from "./pages/AdminProfile/AdminProfile";
import AdminSettings from "./pages/Admin/AdminSettings";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />;
        <Route path="/events" element={<Events />} />;
        <Route path="/about" element={<About/>} />;
        <Route path="/contact" element={<Contact/>} />;
        <Route path="/event/:id" element={<EventDetails/>} />;
        <Route path="/booking" element={<Booking/>}/>;
        <Route path="/register" element={<Register/>}/>;
        <Route path="/login" element={<Login/>} />;
        <Route path ="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/verify-reset-otp" element={<VerifyResetOtp/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard/>
            </ProtectedRoute>
          }
        />;
        {/* <Route path="/dashboard" element={<Dashboard/>}/> */}
        <Route path="/admin" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard/>
            </ProtectedRoute>
          }
        />;
        <Route
          path="/admin/create-event"
          element={
            <ProtectedRoute allowedRoles={["admin", "organiser"]}
            redirectTo="/become-organiser">
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRoles={["admin", "organiser"]}>
              <AdminEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-event/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "organiser"]}>
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={["admin", "organiser"]}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route path="/become-organiser" element={<BecomeOrganiser/>}/>
        <Route path="/admin/organiser-applications" element={<AdminOrganiserApplications/>}/>
        <Route path="/premium" element={<PremiumPlans/>}/>
        <Route path="/premium-plans" element={<PremiumPlans/>}/>
        <Route path="/organiser" 
          element={
            <ProtectedRoute allowedRoles={["organiser"]}>
              <OrganiserDashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin", "organiser"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={["admin", "organiser"]}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={<PaymentSuccess/>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;