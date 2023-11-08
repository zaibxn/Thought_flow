import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check the user's authentication status (e.g., by verifying a stored token or cookie)
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      // Token exists, user is authenticated
      setIsLoggedIn(true);
      setToken(storedToken);
    }
  }, []);

  const login = (newToken) => {
    // Perform the login logic here (e.g., after a successful API request)
    localStorage.setItem("token", newToken);
    setIsLoggedIn(true);
    setToken(newToken);
  };

  const logout = () => {
    // Perform the logout logic here (e.g., clearing the token or session data)
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

