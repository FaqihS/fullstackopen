const Blog = require("../models/blog");
const supertest = require("supertest");
const app = require("../app");
const { initialBlogs, blogsInDb, nonExistingId } = require("./blogTest_helper");
const mongoose = require("mongoose");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe("when initially a blogs in db", () => {
  test("blogs should return as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("blogs json should have id property not _id", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogs = response.body;

    for (const blog of blogs) {
      expect(blog.id).toBeDefined();
    }
  });
});

describe("adding a blog", () => {
  test("succeeds with proper data ", async () => {
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

  test("with no likes props will default to 0", async () => {
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

  test("with no title and url props will send 400", async () => {
    const newBlog = {
      author: "Somebody",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogAtEnd = await blogsInDb();
    expect(blogAtEnd).toHaveLength(initialBlogs.length);
  });
});

describe("deletion of the blog", () => {
  test("succeeds with proper id", async () => {
    const blogAtStart = await blogsInDb();

    const blogToDelete = blogAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogAtEnd = await blogsInDb();

    expect(blogAtEnd).toHaveLength(blogAtStart.length - 1);

    const content = blogAtEnd.map((b) => b.title);
    expect(content).not.toContain(blogToDelete.title);
  });

  test("fails 404 if id not found", async () => {
    const fakeId = await nonExistingId();
    await api.delete(`/api/blogs/${fakeId}`).expect(404);
    const blogAtEnd = await blogsInDb();
    expect(blogAtEnd).toHaveLength(initialBlogs.length);
  });
});

describe("udpdating note", () => {
  test("succeeds with valid id even if no request body ", async () => {
    const blogAtStart = await blogsInDb();

    const blogToUpdate = blogAtStart[0];

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .expect(200);

    expect(updatedBlog.body.likes).not.toBe(blogAtStart.likes);
    const blogAtEnd = await blogsInDb();

    expect(blogAtEnd).toHaveLength(blogAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
