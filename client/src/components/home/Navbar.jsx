import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Switch from "@mui/material/Switch";
import PostIcon from "./Post.png";

export default function Navbar({ darkMode, setDarkMode }) {
  const { isLoggedIn, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    // If the user is not logged in, navigate to the login page
    navigate("/login");
  };

  const toggleDarkMode = () => {
    // Toggle the dark mode when the switch is clicked
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    // Perform the actual logout action
    logout();
    setAnchorEl(null); // Close the menu after logout
  };

  const appBarColor = darkMode ? "primary" : "default";

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      })}
    >
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color={appBarColor}>
          <Toolbar>
            <InputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: darkMode ? "white" : "black",
              }}
            >
              <span
                style={{
                  fontFamily: "cursive",
                  fontSize: "24px",
                }}
              >
                ThoughtFlow
              </span>
            </Typography>
            {isLoggedIn ? (
              <>
                <Link to="/create-post" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={
                      <img
                        src={PostIcon}
                        alt="Post"
                        width="30px"
                        height="30px"
                        style={{
                          filter: darkMode ? "invert(1)" : "none",
                        }}
                      />
                    }
                  >
                    Create Post
                  </Button>
                </Link>
                <div>
                  <IconButton
                    size="large"
                    aria-label="account of the current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    <MenuItem>
                      Dark Mode
                      <Switch
                        checked={darkMode}
                        onChange={toggleDarkMode}
                      />
                    </MenuItem>
                  </Menu>
                </div>
              </>
            ) : (
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleLoginClick}
                >
                  Login
                </Button>
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  color="secondary"
                />
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
