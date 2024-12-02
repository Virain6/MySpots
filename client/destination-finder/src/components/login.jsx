import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "./utils/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verificationLink, setVerificationLink] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { login } = useAuth(); // Access the login function from context
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const { idToken, user } = await loginUser(email, password);

      // Save the ID token and user info globally
      login(idToken, user);

      // Redirect to the map page
      navigate("/map");
    } catch (err) {
      // Handle unverified email with a verification link
      if (err.message.startsWith("http")) {
        setVerificationLink(err.message);
        setIsPopupVisible(true);
        setError("Email not verified. Please verify your email.");
      } else {
        setError(
          err.message === "Firebase: Error (auth/invalid-credential)."
            ? "Invalid email or password."
            : err.message
        );
      }
    }
  };

  const closePopup = () => setIsPopupVisible(false);

  return (
    <div
      className="bg-violet-950 flex items-center justify-center"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-center text-violet-950">
          Login to Your Account
        </h2>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <form className="mt-6" onSubmit={handleLogin}>
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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-violet-950"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-500 hover:underline font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>

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
              Resend Verification Email
            </a>
            <br />
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

export default LoginPage;
