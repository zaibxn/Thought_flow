import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  // Function to check and set the authentication status
  const checkAuthentication = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
    } else {
      setIsLoggedIn(false);
      setToken(null);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []); // Empty dependency array ensures this runs once on component mount

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setIsLoggedIn(true);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setToken(null);
  };

  // Create an object with user state and login/logout functions
  const authState = {
    isLoggedIn,
    token,
    login,
    logout,
    checkAuthentication, // Export the checkAuthentication function
  };

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
