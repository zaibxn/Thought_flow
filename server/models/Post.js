// models/blogPost.js
import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tags: [String], // An array of tags for categorization
  timeUploaded: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  favorites: {
    type: Number,
    default: 0,
  },
  share: {
    whatsapp: String,
    facebook: String,
    instagram: String,
    link: String,
  },
  copyLink: String,
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

export default BlogPost;
