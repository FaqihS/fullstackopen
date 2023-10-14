import { useState, useEffect, useRef } from 'react'
// import "./index.css";
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notif, setNotif] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) =>
      setBlogs(
        blogs.toSorted((a, b) => {
          return b.likes - a.likes
        })
      )
    )
  }, [])

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedUser'))
    if (user) {
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const usernameChanged = ({ target }) => {
    setUsername(target.value)
  }

  const passChanged = ({ target }) => {
    setPassword(target.value)
  }

  const userLogin = async (e) => {
    e.preventDefault()
    const loginUser = {
      username,
      password,
    }

    try {
      const logged = await blogService.login(loginUser)
      window.localStorage.setItem('loggedUser', JSON.stringify(logged))
      blogService.setToken(logged.token)
      setUser(logged)
      setNotif({
        message: 'login succes',
        type: 'ok',
      })
      setTimeout(() => setNotif(null), 2000, [])
    } catch {
      setNotif({
        message: 'wrong username and password',
        type: 'err',
      })
      setTimeout(() => setNotif(null), 2000, [])
    } finally {
      setUsername('')
      setPassword('')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    setNotif({
      message: 'logout succes',
      type: 'ok',
    })
    setTimeout(() => setNotif(null), 2000, [])
  }

  const addBlog = async (blog) => {
    blogFormRef.current.toggleVisible()
    const newBlog = {
      ...blog,
    }
    try {
      const addedBlog = await blogService.create(newBlog)
      setNotif({
        message: `a new blog ${addedBlog.title} by ${addedBlog.author} added`,
        type: 'ok',
      })
      setTimeout(() => setNotif(null), 2000, [])
      setBlogs(
        blogs.concat(addedBlog).toSorted((a, b) => {
          return b.likes - a.likes
        })
      )
    } catch (e) {
      setNotif({
        message: e.response.data.err,
        type: 'err',
      })
      setTimeout(() => setNotif(null), 2000, [])
    }
  }

  const handleLike = async (blog) => {
    const updated = await blogService.update(blog)
    const updatedBlogs = blogs
      .map((b) => (b.id != updated.id ? b : updated))
      .toSorted((a, b) => {
        return b.likes - a.likes
      })
    setBlogs(updatedBlogs)
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      const deleted = await blogService.deleteBlog(blog)
      if (deleted?.error) {
        setNotif({
          message: deleted.error,
          type: 'err',
        })
        setTimeout(() => setNotif(null), 2000, [])
        return
      }
      setBlogs(blogs.filter((b) => b.id != blog.id))
    }
  }

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
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {notif && <Notification notif={notif} />}
      <p>{user.name} logged in </p>
      <button onClick={handleLogout}>Log out</button>
      <Togglable
        buttonLabelShow="new note"
        type="after"
        buttonLabelHide="cancel"
        ref={blogFormRef}
      >
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} handleLike={handleLike}>
          {user.username === blog.user?.username && (
            <button onClick={() => handleDelete(blog)}>Remove</button>
          )}
        </Blog>
      ))}
    </div>
  )
}

export default App
