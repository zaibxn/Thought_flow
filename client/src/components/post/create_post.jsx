import React, { useState } from "react";
import { useAuth } from "../../context/authcontext"

function CreatePost() {
  const { isLoggedIn, token } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [share, setShare] = useState("");
  const [copyLink, setCopyLink] = useState("");

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
          Authorization: `Bearer ${token}`, // Include a space after Bearer
        },
        body: JSON.stringify({
          title,
          body,
          tags: tags.split(",").map((tag) => tag.trim()),
          share,
          copyLink,
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
  }

  return (
    <div>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tags (comma-separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div>
          <label>Share:</label>
          <input
            type="text"
            value={share}
            onChange={(e) => setShare(e.target.value)}
          />
        </div>
        <div>
          <label>Copy Link:</label>
          <input
            type="text"
            value={copyLink}
            onChange={(e) => setCopyLink(e.target.value)}
          />
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
