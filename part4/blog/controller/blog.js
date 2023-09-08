import { Router } from "express";
import Blog from "../models/blog.js";
import { info } from "../utils/logger.js";

const blogRoute = Router();

blogRoute.get("/", (req, res) => {
  Blog.find({}).then((blogs) => {
    blogs ? res.json(blogs) : res.status(404).end()
  });
});

blogRoute.get("/:id", (req, res, next) => {
  Blog.findById(req.params.id)
    .then((blog) => {
      blog ? res.json(blog) : res.status(404).end()
    })
    .catch((err) => next(err));
});

blogRoute.post("/", (req, res, next) => {
  const blog = new Blog(req.body);

  blog
    .save()
    .then((savedBlog) => {
      res.status(201).json(savedBlog);
    })
    .catch((err) => next(err));
});

blogRoute.delete("/:id", (req, res, next) => {
  Blog.findByIdAndDelete(req.params.id)
    .then((result) => {
      result ? res.status(204).end() : res.status(404).end()
    })
    .catch((err) => next(err));
});

blogRoute.put("/:id", (req, res, next) => {
  const blog = {
    ...req.body,
  };

  Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
    .then((updatedBlog) => {
      updatedBlog ? res.json(updatedBlog) : res.status(404).end()
    })
    .catch((err) => next(err));
});

export default blogRoute
