// Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from "../post/post"
import { Container, Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
  },
}));

const Home = () => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/post')
      .then(response => {
        console.log('Fetched posts:', response.data);
        setPosts(response.data);
      })
      .catch(error => console.error('Error fetching blog posts:', error));
  }, []);

  return (
    <Container className={classes.container}>
      <Grid container spacing={3}>
        {posts.map(post => (
          <Grid item key={post._id} xs={12}>
            <Post post={post} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
