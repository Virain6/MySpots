import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const getProfile = async () => {
    if (!token) {
      throw new Error("No authentication token available");
    }

    try {
      const response = await fetch("http://localhost:3001/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const profile = await response.json();
      return profile;
    } catch (err) {
      console.error("Error fetching profile:", err);
      throw err;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3001/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to validate token");
        }

        const profile = await response.json();
        setUser(profile);
      } catch (err) {
        console.error("Error initializing auth:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, loading, getProfile }}
    >
      {!loading ? children : <p>Loading authentication...</p>}
    </AuthContext.Provider>
  );
};
