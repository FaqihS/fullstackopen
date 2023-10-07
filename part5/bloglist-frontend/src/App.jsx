import { useState, useEffect } from "react";
import "./index.css";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Login from "./components/Login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem("loggedUser"));
    if (user) {
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const usernameChanged = ({ target }) => {
    setUsername(target.value);
  };

  const passChanged = ({ target }) => {
    setPassword(target.value);
  };

  const userLogin = async (e) => {
    e.preventDefault();
    const loginUser = {
      username,
      password,
    };

    try {
      const logged = await blogService.login(loginUser);
      window.localStorage.setItem("loggedUser", JSON.stringify(logged));
      setUser(logged);
      setNotif({
        message: `login succes`,
        type: "ok",
      });
      setTimeout(() => setNotif(null), 2000, []);
    } catch {
      setNotif({
        message: "wrong username and password",
        type: "err",
      });
      setTimeout(() => setNotif(null), 2000, []);
    } finally {
      setUsername("");
      setPassword("");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
    setNotif({
      message: `logout succes`,
      type: "ok",
    });
    setTimeout(() => setNotif(null), 2000, []);
  };

  const addBlog = async (e) => {
    e.preventDefault();
    const newBlog = {
      title,
      author,
      url,
    };
    try {
      const addedBlog = await blogService.create(newBlog);
      setNotif({
        message: `a new blog ${addedBlog.title} by ${addedBlog.author} added`,
        type: "ok",
      });
      setTimeout(() => setNotif(null), 2000, []);
      setBlogs(blogs.concat(addedBlog));
    } catch (e) {
      setNotif({
        message: e.response.data.err,
        type: "err",
      });
      setTimeout(() => setNotif(null), 2000, []);
    } finally {
      setAuthor("");
      setTitle("");
      setUrl("");
    }
  };

  if (!user) {
    return (
      <div>
        {notif && <Notification notif={notif} />}
        <Login
          username={username}
          usernameChanged={usernameChanged}
          password={password}
          passChanged={passChanged}
          handleLogin={userLogin}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      {notif && <Notification notif={notif} />}
      <p>{user.name} logged in </p>
      <button onClick={handleLogout}>Log out</button>
      <form onSubmit={addBlog}>
        <div>
          title:{" "}
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:{" "}
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:{" "}
          <input
            type="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Add blog</button>
      </form>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
