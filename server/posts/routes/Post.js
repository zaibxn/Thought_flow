import express from 'express';
import { createBlogPost, getBlogPosts, getBlogPost, updateBlogPost, deleteBlogPost } from '../controllers/Post.js';
import requireAuth from '../middleware/Post.js';

const router = express.Router();

// Create a new blog post (require authentication)
router.post('/create', requireAuth, createBlogPost);

// Get a list of all blog posts
router.get('/', getBlogPosts);

// Get a specific blog post by ID
router.get('/:id', getBlogPost);

// Update an existing blog post (require authentication)
router.put('/:id', requireAuth, updateBlogPost);

// Delete a blog post (require authentication)
router.delete('/:id', requireAuth, deleteBlogPost);

export default router;
