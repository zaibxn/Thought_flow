import React, { useState } from "react";
import { useAuth } from "../../context/authcontext";
import Navbar from "./../home/Navbar";
import { TextField, Button, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100vh",
    marginTop: theme.spacing(1),
    margin: `0 calc(30% - ${theme.spacing(25)}px)`,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  textField: {
    width: "100%",
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "transparent",
      },
      "&:hover fieldset": {
        borderColor: "transparent",
      },
      "&.Mui-focused fieldset": {
        borderColor: "transparent",
      },
    },
  },
  titleInput: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: theme.palette.primary.main,
    "&::placeholder": {
      color: theme.palette.text.secondary,
      fontStyle: "italic",
    },
  },
  bodyInput: {
    fontSize: "1rem",
    fontFamily: "Times New Roman, Times, serif",
  },
  button: {
    width: "15%",
    marginTop: theme.spacing(0),
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    color: "#000000",
    border: "1px solid #000000",
    borderRadius: "1.5rem",
    fontSize: "0.8rem",
    padding: theme.spacing(0.5, 2),
  },
  // Add a new class for the dark mode
  darkModeText: {
    color: "#FFFFFF", // Set the text color for dark mode
  },
}));

function CreatePost({ darkMode, setDarkMode }) {
  const classes = useStyles();
  const { isLoggedIn, token } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Add a condition to set the color based on the darkMode
  const inputTextColor = darkMode ? "#FFFFFF" : "#000000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      console.error("User is not logged in");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          body,
        }),
      });

      if (response.ok) {
        console.log("Post created successfully");
      } else {
        console.error("Error creating the blog post");
      }
    } catch (error) {
      console.error("Error creating the blog post", error);
    }
  };

  return (
    <div>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Container component="main" maxWidth="md" className={classes.root}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            className={`${classes.textField} ${classes.titleInput} ${
              darkMode && classes.darkModeText
            }`}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="title"
            name="title"
            placeholder="Title"
            InputLabelProps={{ shrink: title !== "" }}
            inputProps={{
              style: {
                fontSize: "1rem", // Set the font size back to 1rem
                fontWeight: "bold",
                fontFamily: "Times New Roman, Times, serif",
                color: inputTextColor, // Set text color based on the darkMode
              },
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            className={`${classes.textField} ${classes.bodyInput} ${
              darkMode && classes.darkModeText
            }`}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="body"
            name="body"
            multiline
            minRows={2}
            maxRows={200}
            placeholder="Tell us your story..."
            InputLabelProps={{ shrink: body !== "" }}
            inputProps={{
              style: {
                fontSize: "1rem", // Set the font size back to 1rem
                fontFamily: "Times New Roman, Times, serif",
                color: inputTextColor, // Set text color based on the darkMode
              },
            }}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="default"
            className={classes.button}
          >
            Publish
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default CreatePost;
