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
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useFormik } from "formik";
import zxcvbn from "zxcvbn";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useAuth } from "../../context/authcontext";


const theme = createTheme({
  palette: {
    primary: {
      main: "#0077b6",
    },
    secondary: {
      main: "#fcbf49",
    },
  },
});

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  dob: Yup.date().required("Date of Birth is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  gender: Yup.string().required("Gender is required"),
  agreeToTwoGenders: Yup.boolean()
    .oneOf([true], "Must agree to the statement")
    .required("Must agree to the statement"),
});

const SignUp = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [signupError, setSignupError] = useState("");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      dob: null,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      agreeToTwoGenders: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/auth/register",
          values
        );
        console.log(response.data);

        login(response.data.token);
        navigate("/home");
      } catch (err) {
        console.error(err.response.data);

        if (err.response.data.message === "Email already in use") {
          setEmailError("Email already in use");
        }

        if (err.response.data.message === "Username taken") {
          setUsernameError("Username taken");
        }

        setSignupError("Signup failed. Please check your information.");
      }
    },
  });

  const checkUsernameExists = async () => {
    setIsCheckingUsername(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/auth/check-username/${formik.values.username.toLowerCase()}`
      );
      if (response.data.exists) {
        setUsernameError("Username already taken");
      } else {
        setUsernameError("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const checkEmailExists = async () => {
    setIsCheckingEmail(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/auth/check-email/${formik.values.email.toLowerCase()}`
      );
      if (response.data.exists) {
        setEmailError("Email already in use");
      } else {
        setEmailError("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const checkPasswordStrength = (password) => {
    const result = zxcvbn(password);
    const passwordStrength = result.score + 1;

    const requirementsMet =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        password
      );

    let progressBarColor = "#f50057";
    if (passwordStrength >= 3 && requirementsMet) {
      progressBarColor = "#ffc400";
    }
    if (passwordStrength >= 4 && requirementsMet) {
      progressBarColor = "#4caf50";
    }
    if (passwordStrength === 6) {
      progressBarColor = "#1976d2";
    }

    const requirementsMessage = requirementsMet
      ? "Password requirements met."
      : "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";

    return (
      <div>
        <LinearProgress
          variant="determinate"
          value={(passwordStrength / 6) * 100}
          sx={{ backgroundColor: progressBarColor }}
        />
        <Typography
          variant="body2"
          sx={{ color: progressBarColor, marginTop: "8px" }}
        >
          Password strength: {passwordStrength}/6. {requirementsMessage}
        </Typography>
      </div>
    );
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    formik.handleChange(e);
    setPasswordMatchError("");
    setShowPasswordStrength(true);
  };

  const handleConfirmPasswordChange = (e) => {
    formik.handleChange(e);
    setPasswordMatchError(
      e.target.value !== formik.values.password ? "Passwords do not match" : ""
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="xs"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CssBaseline />
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "80%", height: "auto", marginTop: "10%" }}
          />
        </div>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form
          onSubmit={formik.handleSubmit}
          noValidate
          style={{ width: "100%", marginTop: "8px" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={formik.values.dob}
                  onChange={(value) => formik.setFieldValue("dob", value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={formik.touched.dob && Boolean(formik.errors.dob)}
                      helperText={formik.touched.dob && formik.errors.dob}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={(e) => {
                  formik.handleChange(e);
                  setUsernameError("");
                  checkUsernameExists();
                }}
                onBlur={() => checkUsernameExists()}
                error={Boolean(usernameError)}
                helperText={usernameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="email"
                label="Email Address"
                value={formik.values.email}
                onChange={(e) => {
                  formik.handleChange(e);
                  setEmailError("");
                  checkEmailExists();
                }}
                onBlur={() => checkEmailExists()}
                error={Boolean(emailError)}
                helperText={emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={handlePasswordChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={
                  formik.touched.password ? formik.errors.password : null
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleShowPassword}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={formik.values.confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={Boolean(passwordMatchError)}
                helperText={passwordMatchError}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl required fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  label="Gender"
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTwoGenders"
                    color="primary"
                    checked={formik.values.agreeToTwoGenders}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "agreeToTwoGenders",
                        e.target.checked
                      )
                    }
                  />
                }
                label="I agree that there are only two genders"
                error={
                  formik.touched.agreeToTwoGenders &&
                  Boolean(formik.errors.agreeToTwoGenders)
                }
              />
            </Grid>
            {showPasswordStrength && (
              <Grid item xs={12}>
                {checkPasswordStrength(formik.values.password)}
              </Grid>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isCheckingUsername || isCheckingEmail || !formik.isValid}
          >
            Sign Up
          </Button>

          {signupError && (
            <Typography variant="body2" sx={{ color: "red", marginTop: "8px" }}>
              {signupError}
            </Typography>
          )}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
        <Box mt={5}>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            style={{ marginBottom: "9%" }}
          >
            {"Copyright © "}
            <Link color="inherit" to="/">
              ThoughtFlow
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;

