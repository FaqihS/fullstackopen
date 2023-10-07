import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null
const setToken = (t)=>{
  token = `Bearer ${t}`
}

const getAll = async() => {
  const request = await axios.get(baseUrl)
  return request.data
}

const login = async (user) =>{
  const req = await axios.post("http://localhost:3001/api/login",user)
  return req.data
}

const create = async (blog) => {
  const config = {
    headers: {
      Authorization: token,
    }
  }
  const req = await axios.post(baseUrl,blog,config)
  return req.data
}

export default { getAll,login,create,setToken }
