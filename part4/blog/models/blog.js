const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  
    
  }

});

blogSchema.set("toJSON", {
  transform: (doc, returned) => {
    returned.id = returned._id;
    delete returned._id;
    delete returned.__v;
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports =  Blog
