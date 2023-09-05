import mongoose from "mongoose"
import { configDotenv } from "dotenv"

configDotenv()

const url = process.env.MONGODB_URI
mongoose.set('strictQuery',false)
console.log('Connecting..')
mongoose.connect(url)
.then(res =>{
    console.log('Connected')
  })
.catch(er=>{
    console.log('Error :',er.message)
  })


const personSchema = new mongoose.Schema ({
  name: String,
  number: String,
})
personSchema.set('toJSON',{
  transform: (document,returnedObj) =>{
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  } 
})

const Person = mongoose.model('Person',personSchema) 

export default Person
