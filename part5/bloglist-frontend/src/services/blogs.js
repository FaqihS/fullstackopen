import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null
const setToken = (t) => {
  token = `Bearer ${t}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const login = async (user) => {
  const req = await axios.post('http://localhost:3001/api/login', user)
  return req.data
}

const create = async (blog) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }
  const req = await axios.post(baseUrl, blog, config)
  return req.data
}

const update = async (blog) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }

  const newBlog = {
    ...blog,
    likes: blog.likes + 1,
  }

  const req = await axios.put(`${baseUrl}/${blog.id}`, newBlog, config)

  return req.data
}

const deleteBlog = async (blog) => {
  const config = {
    headers: {
      Authorization: token,
    },
  }

  const req = await axios.delete(`${baseUrl}/${blog.id}`, config)

  if (req.data) return req.data
}

export default { getAll, login, create, setToken, update, deleteBlog }
