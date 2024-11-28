import React, { createContext, useState, useContext } from "react";

// Create the AuthContext
const AuthContext = createContext();

// Create a custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token); // Persist token across sessions
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
