import express from "express";
import morgan from "morgan";
import Person from "./models/person.js";
import cors from "cors"

const app = express();

morgan.token("body", (req) =>
  req.method == "POST" ? JSON.stringify(req.body) : ""
);



app.use(express.json());
app.use(cors())
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);


const unknownEndpoint = (request, response) => {
  console.log("Unknown Endpoint");
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/info", (req, res,next) => {
   Person.find({}).then(p => {
    const totalPersons = p.length
    const time = new Date();
    res.send(`<p>Total Person = ${totalPersons}</p><br><p>Time now ${time}</p>`);

  }) 
  .catch(err => next(err))
  

});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((person) => {
    res.json(person);
  });
});

app.get("/api/persons/:id", (req, res,next) => {
  Person.findById(req.params.id)
    .then((person) => {
      person ? res.json(person) : res.status(404).end();
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res,next) => {
  Person.findByIdAndDelete(req.params.id)
  .then(result=>{
      res.status(204).end()
    })
  .catch(err => next(err))
});


app.post("/api/persons", (req, res,next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    res.status(400).json({
      error: "Must contain name and number",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  })
  .catch(err => next(err))
});

app.put("/api/persons/:id", (req, res,next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    res.status(400).json({
      error: "Name and number Required",
    });
  }

  

  const updatePerson = {
    number: body.number,
  };

 Person.findByIdAndUpdate(req.params.id,updatePerson, {new : true}) 
  .then(updatedPerson => {
      res.json(updatedPerson)
    })
  .catch(err => next(err))

  
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
// this has to be the last loaded middleware.
app.use(unknownEndpoint);
app.use(errorHandler)


const PORT = 3001;

app.listen(PORT);
console.log(`Server running on ${PORT}`);
