import BlogPost from '../../models/Post.js';

// Create a new blog post
export const createBlogPost = async (req, res) => {
  try {
    const { title, body, tags, share, copyLink } = req.body;
    const author = req.user.id; // Assuming you store user information in req.user

    const blogPost = await BlogPost.create({
      title,
      body,
      tags,
      author,
      share,
      copyLink,
    });

    res.status(201).json(blogPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a list of all blog posts
export const getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().populate('author', 'username'); // Populate the author field
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific blog post by ID
export const getBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id).populate('author', 'username'); // Populate the author field
    if (!blogPost) {
      res.status(404).json({ message: 'Blog post not found' });
      return;
    }
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing blog post
export const updateBlogPost = async (req, res) => {
  try {
    const { title, body, tags, share, copyLink } = req.body;
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      res.status(404).json({ message: 'Blog post not found' });
      return;
    }

    if (String(blogPost.author) !== req.user.id) {
      res.status(403).json({ message: 'You do not have permission to update this post' });
      return;
    }

    blogPost.title = title;
    blogPost.body = body;
    blogPost.tags = tags;
    blogPost.share = share;
    blogPost.copyLink = copyLink;

    await blogPost.save();

    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a blog post
export const deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      res.status(404).json({ message: 'Blog post not found' });
      return;
    }

    if (String(blogPost.author) !== req.user.id) {
      res.status(403).json({ message: 'You do not have permission to delete this post' });
      return;
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};