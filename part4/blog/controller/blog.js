const blogRoute = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const { info } = require("../utils/logger");
const { userExtractor } = require("../utils/middleware");

blogRoute.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  blogs ? res.json(blogs) : res.status(404).end();
});

blogRoute.get("/:id", async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate("user", {
    username: 1,
    name: 1,
  });

  blog ? res.json(blog) : res.status(404).end();
});


blogRoute.post("/", async (req, res) => {
  const { author, title, url, likes } = req.body;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({
      error: "invalid token",
    });
  }

  const user = await User.findById(decodedToken.id);

  if (!(author && title && url)) {
    res.status(400).send({ err: "Wrong request format" });
  }

  const blog = new Blog({
    ...req.body,
    likes: likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id);

  await user.save();
  // await savedBlog.populate({
  //   username: 1,
  //   name: 1,
  // });

  res.status(201).json(savedBlog);
});

blogRoute.delete("/:id",userExtractor, async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({
      error: "token invalid",
    });
  }

  const blogToDel = await Blog.findById(req.params.id);
  if (!blogToDel) return res.status(404).end();
  if (!(blogToDel.user.toString() === req.user))
    return res.status(401).json({
      error: "Not the owner",
    });

  await blogToDel.deleteOne();
  res.status(204).end();
});

blogRoute.put("/:id", async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({
      error: "token invalid",
    });
  }
  const blogToUpdate = await Blog.findById(req.params.id);
  if (!blogToUpdate) return res.status(404).end();
  if (!(blogToUpdate.user.toString() === decodedToken.id))
    return res.status(401).json({ error: "invalid token" });

  const blog = {
    likes: blogToUpdate.likes + 1,
  };

  const updatedBlog = await blogToUpdate
    .updateOne(blog, { new: true })
    .populate({
      username: 1,
      name: 1,
    });

  res.json(updatedBlog);
});

module.exports = blogRoute;
