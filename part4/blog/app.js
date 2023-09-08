import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { error, info } from "./utils/logger.js";
import blogRoute from "./controller/blog.js";
import { errorHandler, reqLogger, unkownEndpoint } from "./utils/middleware.js";
import { DB_URL } from "./utils/config.js";

const app = express();

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

export default app;
