import express from "express";
import morgan from "morgan";

const app = express();

morgan.token("body", (req) =>
  req.method == "POST" ? JSON.stringify(req.body) : ""
);

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

const unknownEndpoint = (request, response) => {
  console.log("Unknown Endpoint");
  response.status(404).send({ error: "unknown endpoint" });
};



app.get("/info", (req, res) => {
  const totalPersons = persons.length
  const time = new Date();

  res.send(`<p>Total Person = ${totalPersons}</p><br><p>Time now ${time}</p>`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;

  return maxId + 1;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    res.status(400).json({
      error: "Must contain name and number",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  if (persons.find((p) => p.name === person.name)) {
    res.status(400).json({
      error: "Name must be unique",
    });
  }

  persons = persons.concat(person);

  res.json(person);
});

app.put("/api/persons/:id", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    res.status(400).json({
      error: "Name and number Required",
    });
  }

  const oldPerson = persons.find((p) => p.name === body.name);

  if (!oldPerson) {
    res.status(404).json({
      error: "Person Not found",
    });
  }
  const newPerson = {
    ...oldPerson,
    number: body.number,
  };

  persons = persons.map((p) => (p.id !== newPerson.id ? p : newPerson));

  res.json(newPerson);
});

app.use(unknownEndpoint);

const PORT = 3001;

app.listen(PORT);
console.log(`Server running on ${PORT}`);
