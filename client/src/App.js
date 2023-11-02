// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/auth/register";
import SignIn from "./components/auth/login";
import Home from "./components/home/home";
import Navbar from "./components/home/Navbar";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    // Set the user information upon successful login
    setUser(userData);
  };

  const handleLogout = () => {
    // Clear user information upon logout
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<SignUp />} 
        />
        <Route
          path="/login"
          element={<SignIn onLogin={handleLogin} />} 
        />
        <Route
          path="/home"
          element={
            <div>
              <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                user={user}
                onLogout={handleLogout}
              />
              <Home />
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
