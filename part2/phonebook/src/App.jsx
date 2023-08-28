import { useState } from "react";
import { Filter, PersonForm, Persons } from "./components/Components";


const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  const addPerson = (e) => {
    e.preventDefault();
    const person = {
      name: newName,
      number: newNumber,
      id: persons.at(-1).id + 1,
    };
    if (person.name) {
      for (const same of persons.map((p) => p.name)) {
        if (person.name === same) {
          alert(`${person.name} is Exist`);
          setNewName("");
          setNewNumber("");
          return;
        }
      }
      setPersons(persons.concat(person));
    }
    setNewName("");
    setNewNumber("");
  };

  const filteredPerson = persons.filter((person) => {
    return person.name
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const handleChange = (input) => {
    const nameChange = (e) => setNewName(e.target.value);
    const numberChange = (e) => setNewNumber(e.target.value);
    const searchChange = (e) =>  setSearch(e.target.value);
    
    return input === "name" ? nameChange
      : input === "number" ? numberChange
      : searchChange;
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleChange={handleChange("search")} />
      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        handleSubmit={addPerson}
        handleChange={handleChange}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPerson} />
    </div>
  );
};

export default App;
