const Blog = require("../models/blog");
const supertest = require("supertest");
const app = require("../app");
const { initialBlogs, blogsInDb } = require("./blogTest_helper");
const mongoose = require("mongoose");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (const blog of initialBlogs) {
    const newBlog = new Blog(blog);
    await newBlog.save();
  }
});

test("blogs should return as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blogs should have id property", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const blogs = response.body;

  for (const blog of blogs) {
    expect(blog.id).toBeDefined();
  }
});

test("new blog with proper request can be posted", async () => {
  const newBlog = {
    author: "Somebody",
    title: "New Blog",
    url: "some-url",
    likes: 3,
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(201);

  const addedBlog = response.body;

  expect(addedBlog.id).toBeDefined();
  expect(addedBlog.author).toBeDefined();
  expect(addedBlog.title).toBeDefined();
  expect(addedBlog.likes).toBeDefined();
  expect(addedBlog.url).toBeDefined();

  const blogAtEnd = await blogsInDb();
  expect(blogAtEnd).toHaveLength(initialBlogs.length + 1);

  const title = blogAtEnd.map((b) => b.title);
  expect(title).toContain(newBlog.title);
});

test("adding blog with no likes props will default to 0", async () => {
  const newBlog = {
    author: "Somebody",
    url: "some-url",
    title: "New Blog",
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(201);

  const addedBlog = response.body;

  expect(addedBlog.id).toBeDefined();
  expect(addedBlog.author).toBeDefined();
  expect(addedBlog.title).toBeDefined();
  expect(addedBlog.likes).toBeDefined();
  expect(addedBlog.url).toBeDefined();

  expect(addedBlog.likes).toBe(0);

  const blogAtEnd = await blogsInDb();
  expect(blogAtEnd).toHaveLength(initialBlogs.length + 1);
  const title = blogAtEnd.map((b) => b.title);
  expect(title).toContain(newBlog.title);
});

test("adding blog with no title and url props will send 400", async () => {
  const newBlog = {
    author: "Somebody",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogAtEnd = await blogsInDb();
  expect(blogAtEnd).toHaveLength(initialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});
