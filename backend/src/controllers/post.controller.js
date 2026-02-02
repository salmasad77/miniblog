const asyncHandler = require("express-async-handler");
const Post = require("../models/Post.model");

exports.createPost = asyncHandler(async (req, res) => {
  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    image: req.file ? `/uploads/posts/${req.file.filename}` : null,
    author: req.user._id,
    category: req.body.category || "General"
  });

  res.status(201).json(post);
});

exports.getPosts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = category && category !== 'All Posts' && category !== 'all' ? { category } : {};

  const posts = await Post.find(filter)
    .populate("author", "name")
    .sort({ createdAt: -1 });
  res.json(posts);
});

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name")
    .populate("comments.user", "name"); // Populate comment authors too

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.json(post);
});

exports.likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // Check if post has already been liked by this user
  if (post.likes.includes(req.user._id)) {
    // Unlike
    post.likes = post.likes.filter(
      (like) => like.toString() !== req.user._id.toString()
    );
  } else {
    // Like
    post.likes.push(req.user._id);
  }

  await post.save();
  res.json(post.likes);
});

exports.addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comment = {
    user: req.user._id,
    text: req.body.content || req.body.text, // Handle both content (frontend) and text (schema)
  };

  post.comments.push(comment);

  await post.save();
  res.status(201).json(post.comments);
});

exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // Check user authorization
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Post.deleteOne({ _id: req.params.id });
  res.json({ message: "Post removed" });
});
