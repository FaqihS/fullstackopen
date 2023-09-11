const blogRoute = require("express").Router();
const Blog = require("../models/blog");

blogRoute.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  blogs ? res.json(blogs) : res.status(404).end();
});

blogRoute.get("/:id", async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  blog ? res.json(blog) : res.status(404).end();
});

blogRoute.post("/", async (req, res, next) => {
  const request = req.body;

  if (!request.author | !request.title | !request.url) {
    res.status(400).send({err:"Wrong request format"})
  } else {
    const blog = new Blog({
      ...req.body,
      likes: request.likes || 0,
    });
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  }
});

blogRoute.delete("/:id", async (req, res ) => {
  const deleted = await Blog.findByIdAndRemove(req.params.id);
  deleted ? res.status(204).end() : res.status(404).end()
});

blogRoute.put("/:id", async (req, res, next) => {

  const blogToUpdate = await Blog.findById(req.params.id)

  const blog = {
    likes: blogToUpdate.likes + 1,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });

  updatedBlog ? res.json(updatedBlog) : res.status(404).end();
});

module.exports = blogRoute;
