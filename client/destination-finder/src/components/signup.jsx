import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For programmatic navigation

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationLink, setVerificationLink] = useState(""); // Store verification link
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Manage popup visibility
  const navigate = useNavigate(); // Hook for navigation

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!email || !password || !nickname) {
      setError("All fields are required.");
      return;
    }

    try {
      // Register the user
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, nickname }),
      });

      const data = await response.json();

      if (response.ok) {
        // Set the verification link and show the popup
        setVerificationLink(data.verificationLink);
        setIsPopupVisible(true);

        // Show success message
        setSuccess(
          "Registration successful! Please check your email and verify your account."
        );
        setError("");
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    navigate("/login"); // Navigate to login page after closing the popup
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-violet-950">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-violet-950">
          Create Your Account
        </h2>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        <form className="mt-6" onSubmit={handleRegister}>
          {/* Nickname */}
          <div className="mb-4">
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-violet-950"
            >
              Nickname
            </label>
            <input
              type="text"
              id="nickname"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-violet-950"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-violet-950"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
      </div>

      {/* Popup for Verification Link */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
            <h3 className="text-lg font-semibold text-violet-950 mb-4">
              Verify Your Email
            </h3>
            <p className="text-gray-700 mb-4">
              Click the link below to verify your email:
            </p>
            <a
              href={verificationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Verify Email
            </a>
            <br></br>
            <button
              onClick={closePopup}
              className="mt-4 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
