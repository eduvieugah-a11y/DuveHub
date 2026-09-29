import "./AdminOrganiserApplications.css";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { API_URL } from "../../api/config";

function AdminOrganiserApplications() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/organiser`
      );

      setApplications(res.data);
    } catch (error) {
      console.error("Failed to process organiser application:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const approveApplication = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/organiser/approve/${id}`
      );

      alert("Application Approved!");

      fetchApplications();
    } catch (error) {
      console.error("Failed to process organiser application:", error);
    }
  };

  const rejectApplication = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/organiser/reject/${id}`
      );

      alert("Application Rejected!");

      fetchApplications();
    } catch (error) {
      console.error("Failed to process organiser application:", error);
    }
  };

  return (
    <AdminLayout>

      <div className="applications">

        <h1>Organiser Applications</h1>

        <table>

          <thead>

            <tr>
              <th>Business</th>
              <th>Phone</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {applications.map((application) => (

              <tr key={application._id}>

                <td>{application.businessName}</td>

                <td>{application.phone}</td>

                <td>{application.category}</td>

                <td>{application.status}</td>

                <td>

                  <button
                    className="approve-btn"
                    onClick={() =>
                      approveApplication(application._id)
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() =>
                      rejectApplication(application._id)
                    }
                  >
                    Reject
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>
  );
}

export default AdminOrganiserApplications;