const { error, info } = require("./logger.js");

const reqLogger = (req, res, next) => {
  info("Method", req.method);
  info("Path", req.path);
  info("Method", req.body);
  info("----");
  next();
};

const unkownEndpoint = (req, res, next) => {
  res.status(404).send({ err: "unkownEndpoint" });
};

const errorHandler = (err, req, res, next) => {
  error("Error", err);
  res.status(400).send({ error: err.message });
  next(err);
};

module.exports = { reqLogger, errorHandler, unkownEndpoint };
