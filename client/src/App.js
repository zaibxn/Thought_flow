import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/auth/register";
import SignIn from "./components/auth/login";
import Home from "./components/home/home";
import Navbar from "./components/home/Navbar";
import CreatePost from "./components/post/create_post";
import { AuthProvider } from "./context/authcontext";
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
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
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
          <Route
            path="/create-post"
            element={<CreatePost />} // Render the CreatePost component
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
