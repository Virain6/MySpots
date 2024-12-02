import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Assuming you have a context for auth
import { fetchUserProfile, updatePassword } from "./utils/api"; // Import API calls

const AccountSettings = () => {
  const { token, logout } = useAuth(); // Use token from context for auth
  const [userDetails, setUserDetails] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user details on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile(token);
        setUserDetails(profile);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    loadProfile();
  }, [token]);

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      await updatePassword(token, { currentPassword, newPassword });
      setSuccess("Password updated successfully!");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Failed to update password. Please try again.");
      setSuccess("");
    }
  };

  if (!userDetails) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold">User Details</h2>
        <p>
          <strong>Nickname:</strong> {userDetails.nickname}
        </p>
        <p>
          <strong>Email:</strong> {userDetails.email}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
