import "./AdminUsers.css";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { API_URL } from "../../api/config";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/users`
      );

      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/api/users/${id}`
      );

      alert("User deleted successfully.");

      fetchUsers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  return (
    <AdminLayout>
      <div className="admin-users">

        <h1>Manage Users</h1>

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (
              <tr key={user._id}>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
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

export default AdminUsers;