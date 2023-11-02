import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown, faHeart, faShare, faLink } from "@fortawesome/free-solid-svg-icons";

const Post = ({ post }) => {
  const { title, body, tags, author, upvotes, downvotes, favorites, share, copyLink } = post;

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-title">{title}</div>
        <div className="post-tags">
          {tags.map((tag, index) => (
            <span key={index} className="post-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="post-body">{body}</div>

      <div className="post-actions">
        <div className="post-author">Posted by {author.username}</div>
        <div className="post-votes">
          <FontAwesomeIcon icon={faArrowUp} /> {upvotes}
          <FontAwesomeIcon icon={faArrowDown} /> {downvotes}
        </div>
        <div className="post-favorites">
          <FontAwesomeIcon icon={faHeart} /> {favorites}
        </div>
        <div className="post-share">
          <FontAwesomeIcon icon={faShare} />
          <div className="share-options">
            <span>WhatsApp</span>
            <span>Facebook</span>
            <span>Instagram</span>
            <span>Copy Link</span>
          </div>
        </div>
        <div className="post-link">
          <FontAwesomeIcon icon={faLink} />
          <a href={copyLink}>Copy Link</a>
        </div>
      </div>
    </div>
  );
};

export default Post;
