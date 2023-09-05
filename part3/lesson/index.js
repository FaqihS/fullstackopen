require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/note')




// mongoose.connect(url)


const app = express()

app.use(express.json())
app.use(cors())


let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/',(req,res)=>{
  res.send('<h1>Hello World</hq>')
})

app.get('/api/notes',(req,res)=>{
  Note.find({}).then(note=>{
    console.log(note)
    res.json(note)

  }).catch(err=>next(err))
})

app.get('/api/notes/:id',(req,res) => {
  Note.findById(req.params.id).then(note =>{
    res.json(note)
  })
  
})

app.delete('/api/notes/:id', (request, response,next) => {
  Note.findByIdAndRemove(request.params.id)
  .then(result => {
      response.status(204).end()
    })
  .catch(err => next(err))


  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})


app.post('/api/notes',(req,res) => {

  const body = req.body


  if(body.content === undefined ){
    res.status(400).json({
      error: "Content not found"
    })
  }
  
  const note = new Note ({
    content: body.content,
    important: body.important || false,
    
  })

  note.save().then(savedNote => {
    res.json(savedNote)
  })

  
})

app.put('/api/notes/:id',(req,res,next) => {


  const newNotes = {
    content: req.body.content,
    important: req.body.important || false,
  }


  Note.findByIdAndUpdate(req.params.id, newNotes , { new: true } )
    .then(updatedNote => {
      console.log(updatedNote)
      res.json(updatedNote)
    })
    .catch(err => next(err))


})
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
