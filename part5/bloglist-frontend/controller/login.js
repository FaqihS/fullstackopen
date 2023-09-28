const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { info } = require("../utils/logger");

loginRouter.post("/", async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  info(user);

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userWithToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userWithToken, process.env.SECRET, {
    expiresIn: 60*60,
  });

  res.status(200).json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
