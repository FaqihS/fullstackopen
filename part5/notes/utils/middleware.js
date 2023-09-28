const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info("Method", req.method);
  logger.info("Path", req.path);
  logger.info("Body", req.body);
  logger.info("----");

  next();
};

const userExtractor = async (req,res,next) => {
  const user = await jwt.verify(req.token,process.env.SECRET)

  if(!user) return res
    .status(401)
    .send({ error: "Not Authorize", })

  req.user = user.id

  next()

}

const tokenExtractor = (req,res,next) => {
  const token = req.get('Authorization')
  if(token && token.startsWith('Bearer')){
    req.token = token.replace("Bearer ","")
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  }
  if (error.name === "TokenExpiredError"){
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error);
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
};
