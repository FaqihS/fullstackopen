const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

userRouter.get('/',async (req,res)=>{
  const users = await User.find({})

  users ? res.json(users) : res.status(404).end()
})

userRouter.post('/',async (req,res)=>{
  const {username, password, name} = req.body
  if(username.length < 3 || password.length <3) return res.status(400).send({
    error: "Username and password length at least 3"
  })

  const passwordHash = await bcrypt.hash(password,5)

  const newUser = new User({
    username,
    passwordHash,
    name
  })

  const user = await newUser.save()

  res.status(200).json(user)

})

module.exports = userRouter
