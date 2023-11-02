// CreatePost.js

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const CreatePost = ({ onPostSubmit }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  const handlePostSubmit = () => {
    const newPost = {
      title,
      body,
      tags: tags.split(",").map(tag => tag.trim()),
      // You can set other properties such as author, timeUploaded, etc. here
    };

    onPostSubmit(newPost);

    // Clear the input fields after submitting
    setTitle("");
    setBody("");
    setTags("");
  };

  return (
    <div className="create-post">
      <h2>Create a New Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Post content"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button onClick={handlePostSubmit}>
        <FontAwesomeIcon icon={faPaperPlane} /> Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
