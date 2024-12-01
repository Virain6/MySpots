import React, { createContext, useState, useContext, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token")); // Load token from localStorage
  const [user, setUser] = useState(null); // User object
  const [loading, setLoading] = useState(true); // Loading state for auth initialization

  // Function to log in the user
  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token); // Persist token in localStorage
  };

  // Function to log out the user
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token"); // Remove token from localStorage
  };

  // Effect to validate and initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setLoading(false); // No token means no user logged in
        return;
      }

      try {
        // Placeholder for token validation (e.g., backend validation or decoding)
        const isValid = true; // Replace with actual validation logic if needed
        if (!isValid) {
          console.warn("Invalid token, logging out...");
          logout();
          return;
        }

        // Simulate fetching user info (if needed, replace with actual API call)
        const fetchedUser = { uid: "12345", name: "John Doe" }; // Replace with real data
        setUser(fetchedUser);
      } catch (err) {
        console.error("Error initializing auth:", err);
        logout(); // Log out on error
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  // Provide token, user, and auth actions to the app
  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {!loading ? children : <p>Loading authentication...</p>}
    </AuthContext.Provider>
  );
};
