const express = require('express')
const app = express()

app.use(express.json())


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
  res.json(notes)
})

app.get('/api/notes/:id',(req,res) => {
  const id = Number(req.params.id)
  const note = notes.find(n=> {
    return n.id === id
  })

  note ? res.json(note)
    : res.status(404).end()
  
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)


  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n=>n.id)) : 0
  return maxId + 1
}

app.post('/api/notes',(req,res) => {

  const body = req.body


  if(!body.content ){
    res.status(400).json({
      error: "Content not found"
    })
  }
  
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }

  notes = notes.concat(note)

  res.json(note)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
