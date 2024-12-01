import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../assets/firebase/firebase"; // Import the initialized Firebase Auth

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // Access the login function from context
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Handle the login function
  const handleLogin = async (e) => {
    e.preventDefault();

    // Check for validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sign in with the custom token
        const userCredential = await signInWithCustomToken(auth, data.token);

        // Get the ID token
        const idToken = await userCredential.user.getIdToken();

        console.log("ID Token:", idToken); // Debugging log to verify the token

        // Save the ID token and user info globally
        login(idToken, { email });

        // Redirect to the map page
        navigate("/map");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

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
          {/* Email Input */}
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
          {/* Password Input */}
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
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        {/* Additional Links */}
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
    </div>
  );
};

export default LoginPage;
