import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "./logo.png";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0077b6"
    },
    secondary: {
      main: "#fcbf49"
    }
  }
});

const validationSchema = Yup.object({
  usernameOrEmail: Yup.string().required("Username or Email is required"),
  password: Yup.string().required("Password is required")
});

const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [usernameOrEmailError, setUsernameOrEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      usernameOrEmail: "",
      password: ""
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/auth/login",
          values
        );
        console.log(response.data);
        navigate("/home");
      } catch (err) {
        console.error(err.response.data);

        if (err.response.data.message === "Invalid credentials") {
          setUsernameOrEmailError("Invalid credentials");
          setPasswordError("Invalid credentials");
          enqueueSnackbar("Invalid credentials", { variant: "error" });
        }

        setLoginError("Login failed. Please check your credentials.");
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <img src={Logo} alt="Logo" width="80%" height="100" />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="usernameOrEmail"
                  required
                  fullWidth
                  id="usernameOrEmail"
                  label="Username or Email"
                  autoFocus
                  value={formik.values.usernameOrEmail}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.usernameOrEmail &&
                    Boolean(
                      formik.errors.usernameOrEmail || usernameOrEmailError
                    )
                  }
                  helperText={
                    formik.touched.usernameOrEmail &&
                    (formik.errors.usernameOrEmail || usernameOrEmailError)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password &&
                    Boolean(formik.errors.password || passwordError)
                  }
                  helperText={
                    formik.touched.password &&
                    (formik.errors.password || passwordError)
                  }
                />
                <FormControlLabel
                  control={<Checkbox value={showPassword} color="primary" />}
                  label="Show password"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {loginError && (
              <Typography
                variant="body2"
                sx={{ color: "red", marginTop: "8px" }}
              >
                {loginError}
              </Typography>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item xs>
                <Link to="/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/" variant="body2">
                  Don't have an account? Sign up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
