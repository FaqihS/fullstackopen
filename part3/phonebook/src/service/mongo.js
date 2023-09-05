import mongoose from 'mongoose';

const Person = require('./person')

if(process.argv.length == 3){
  Person.find({}).then(response => {
    console.log('Phonebook:')
    response.forEach( person => {

      console.log(`${person.name} ${person.number}`)
    }


    )
    mongoose.connection.close()

  })
}
if(process.argv.length > 3){
const newPerson = new Person ({
  name: process.argv[3],
  number: process.argv[4]
})

newPerson.save().then(response => {
  const name = response.name
  const number = response.number
 console.log(`Added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
})
}
