const express = require("express");
const app = express();
require('express-async-errors')
const cors = require("cors");
const { error, info } = require("./utils/logger");
const blogRoute = require("./controller/blog");
const {
  errorHandler,
  reqLogger,
  unkownEndpoint,
} = require("./utils/middleware");
const { DB_URL } = require("./utils/config");
const mongoose = require("mongoose");

mongoose
  .connect(DB_URL)
  .then(() => {
    info("Connected");
  })
  .catch((err) => {
    error(err);
  });

app.use(cors());
app.use(express.json());
app.use(reqLogger);

app.use("/api/blogs", blogRoute);

app.use(unkownEndpoint);
app.use(errorHandler);

module.exports =  app
