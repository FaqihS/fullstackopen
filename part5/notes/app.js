const config = require('./utils/config')
require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controller/note')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose =require('mongoose')
const userRouter = require('./controller/user')
const loginRouter = require('./controller/login')



mongoose.set('strictQuery', false)


const url = config.MONGODB_URI


logger.info('connecting to', url)

mongoose.connect(url)
  .then(result => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes',notesRouter)
app.use('/api/users',userRouter)
app.use('/api/login',loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports =  app


