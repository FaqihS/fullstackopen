import axios from "axios";

const baseUrl = "http://localhost:3001/notes";

const getAll = () => {
  const request = axios.get(baseUrl);
  const nonExistingData = {
    id: 12123,
    content: "This is not exist",
    important: true
  }
  return request.then((res) => res.data.concat(nonExistingData));
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((res) => res.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((res) => res.data);
};

export default { getAll, create, update };
