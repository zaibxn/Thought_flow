import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Switch from "@mui/material/Switch";
import PostIcon from "./Post.png";

export default function Navbar({ darkMode, setDarkMode, isLoggedIn }) {
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
    handleClose();
    navigate("/login");
  };

  // Define the theme based on darkMode
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light"
    }
  });

  // Define AppBar color based on darkMode
  const appBarColor = darkMode ? "primary" : "default";

  return (
    <ThemeProvider theme={theme}>
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
                color: darkMode ? "white" : "black"
              }}
            >
              <span
                style={{
                  fontFamily: "cursive",
                  fontSize: "24px"
                }}
              >
                ThoughtFlow
              </span>
            </Typography>
            <IconButton size="small" aria-label="create post" color="inherit">
              <img
                src={PostIcon}
                alt="Post"
                width="30px"
                height="30px"
                style={{ filter: darkMode ? "invert(1)" : "none" }}
              />
            </IconButton>
            <Typography variant="body1">Create Post</Typography>
            {isLoggedIn && (
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                color="secondary"
              />
            )}
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
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={open}
              onClose={handleClose}
            >
              {isLoggedIn ? (
                <>
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleLoginClick}>Logout</MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleLoginClick}>Login</MenuItem>
              )}
              <MenuItem>
                Dark Mode
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
