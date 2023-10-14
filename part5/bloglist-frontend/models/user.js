const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON',{
  transform: (document,returned) => {
    returned.id = returned._id

    delete returned._id
    delete returned.__v
    delete returned.passwordHash


  }
})

const User = mongoose.model('User',userSchema)

module.exports = User
