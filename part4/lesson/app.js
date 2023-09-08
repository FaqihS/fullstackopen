const config = require("./utils/config")
const express = require("express");
const app = express();
const cors = require("cors");
const noteRouter = require("./controller/note")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const mongoose =require('mongoose');
const notesRouter = require("./controller/note");



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

app.use(cors());
app.use(express.static('build'))
app.use(express.json());
app.use(middleware.requestLogger)

app.use('/api/notes',notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler);

module.exports =  app



