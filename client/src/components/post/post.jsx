// Post.js

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import LinkIcon from '@mui/icons-material/Link';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.default : theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  iconButton: {
    marginRight: theme.spacing(1),
  },
}));

const Post = ({ post }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [liked, setLiked] = useState(false);
  const [unliked, setUnliked] = useState(false);
  const [favorited, setFavorited] = useState(false);

  if (!post) {
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            Invalid post data
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const {
    title,
    body,
    tags,
    timeUploaded,
    author,
    upvotes,
    downvotes,
    favorites,
    share,
    copyLink,
  } = post;

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  const handleUnlikeClick = () => {
    setUnliked(!unliked);
  };

  const handleFavoriteClick = () => {
    setFavorited(!favorited);
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <div className={classes.header}>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography color="textSecondary" gutterBottom style={{ marginLeft: 'auto' }}>
            {author.username} {/* Displaying the username */}
          </Typography>
        </div>
        <Typography variant="body2" color="textSecondary">
          {body}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {tags.map((tag, index) => (
            <span key={index}>{`#${tag} `}</span>
          ))}
        </Typography>
      </CardContent>
      <div className={classes.footer}>
        <Grid container alignItems="center">
          <Grid item>
            <Button
              className={classes.iconButton}
              variant={liked ? 'contained' : 'outlined'}
              color="primary"
              startIcon={liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
              onClick={handleLikeClick}
            >
              {upvotes}
            </Button>
            <Button
              className={classes.iconButton}
              variant={unliked ? 'contained' : 'outlined'}
              color="secondary"
              startIcon={unliked ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
              onClick={handleUnlikeClick}
            >
              {downvotes}
            </Button>
            <Button
              className={classes.iconButton}
              variant={favorited ? 'contained' : 'outlined'}
              color="default"
              startIcon={favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={handleFavoriteClick}
            >
              {favorites}
            </Button>
          </Grid>
          <Grid item>
            <Button
              className={classes.iconButton}
              color="primary"
              startIcon={<ShareIcon />}
              href={share?.whatsapp}
            >
              Share on 
            </Button>
            <Button
              className={classes.iconButton}
              color="default"
              startIcon={<LinkIcon />}
            >
              Copy Link
            </Button>
          </Grid>
        </Grid>
      </div>
    </Card>
  );
};

export default Post;
