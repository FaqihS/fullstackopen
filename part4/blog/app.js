const express = require("express");
const app = express();
const cors = require("cors");
const { error, info } = require("./utils/logger");
const blogRoute = require("./controller/blog");
const middleware = require("./utils/middleware");
const { DB_URL } = require("./utils/config");
const mongoose = require("mongoose");
require('express-async-errors')

mongoose.set('strictQuery',false)

mongoose
  .connect(DB_URL)
  .then(() => {
    info("Connected");
  })
  .catch((err) => {
    error(err);
  });

app.use(cors());
app.use(express.static('build'))
app.use(express.json());
app.use(middleware.reqLogger);

app.use("/api/blogs", blogRoute);

app.use(middleware.unkownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
