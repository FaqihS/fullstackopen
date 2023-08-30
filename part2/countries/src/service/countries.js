import axios from "axios"

const getAll = () => {
  const req = axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
  return req.then(res => res.data)
}

export {getAll}
