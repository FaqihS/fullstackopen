const User = require("../models/user.js");
const { error, info } = require("./logger.js");
const jwt = require("jsonwebtoken");

const reqLogger = (req, res, next) => {
  info("Method", req.method);
  info("Path", req.path);
  info("Method", req.body);
  info("----");
  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({
      error: "token invalid",
    });
  }
  // const user = await User.findById(decodedToken.id)
  req.user= decodedToken.id

  next();
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  }

  next();
};

const unkownEndpoint = (req, res) => {
  res.status(404).send({ err: "unkownEndpoint" });
};

const errorHandler = (err, req, res, next) => {
  error("Error", err);
  res.status(400).send({ error: err.message });
  next(err);
};

module.exports = { 
  reqLogger,
  errorHandler,
  unkownEndpoint,
  tokenExtractor,
  userExtractor,
};
