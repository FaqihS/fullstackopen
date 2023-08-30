import axios from "axios"

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  const req = axios.get(baseUrl)
  return req.then(res => res.data)
}

const create = (newPerson) => {
  const req = axios.post(baseUrl,newPerson)
  return req.then(res=>res.data)
}

const update = (newPerson) => {
  const req = axios.put(`${baseUrl}/${newPerson.id}`,newPerson)
  return req.then(res => res.data)
}

const deletePerson = (person) => {
  const req = axios.delete(`${baseUrl}/${person.id}`)
  return req
}

export default {getAll,create: create,update,deletePerson}
