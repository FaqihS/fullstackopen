import axios from 'axios'

const baseUrl= 'http://localhost:3001/api/login'

const loginService = async  (credential) => {
  const req = await axios.post(baseUrl,credential)

  return req.data

}

export default  loginService
