import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  fetchAdminUsers,
  updateAdminUserRole,
  deleteAdminUser,
  toggleUserDisabled,
} from "./utils/api";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const data = await fetchAdminUsers(token);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDisable = async (userId, currentStatus) => {
    try {
      await toggleUserDisabled(token, userId, !currentStatus);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, disabled: !currentStatus } : user
        )
      );
      setSuccessMessage(
        `User ${!currentStatus ? "disabled" : "enabled"} successfully.`
      );
    } catch (err) {
      console.error("Error toggling user disabled state:", err);
      setError("Failed to update user state. Please try again.");
    }
  };

  const updateUserRole = async (userId, newRole) => {
    setUpdateError("");
    setSuccessMessage("");
    try {
      await updateAdminUserRole(token, userId, newRole);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setSuccessMessage(`User role updated to ${newRole}`);
    } catch (err) {
      console.error("Error updating user role:", err);
      setUpdateError("Failed to update user role. Please try again.");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteAdminUser(token, userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setSuccessMessage("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {updateError && <p className="text-red-500">{updateError}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Nickname</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">
                {user.nickname || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {user.email || "N/A"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {user.role || "user"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleToggleDisable(user.id, user.disabled)}
                  className={`px-3 py-1 rounded ${
                    user.disabled
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {user.disabled ? "Enable" : "Disable"}
                </button>
                {user.role !== "manager" && (
                  <button
                    onClick={() => updateUserRole(user.id, "manager")}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2 ml-2"
                  >
                    Promote to Manager
                  </button>
                )}
                {user.role === "manager" && (
                  <button
                    onClick={() => updateUserRole(user.id, "user")}
                    className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 mr-2 ml-2"
                  >
                    Demote to User
                  </button>
                )}
                <button
                  onClick={() => deleteUser(user.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
