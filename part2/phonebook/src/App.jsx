import { useEffect, useState } from "react";
import { Filter, PersonForm, Persons } from "./components/Components";
import personService from "./service/phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  const getAllPerson = () => {
    personService.getAll().then((initalPersons) => {
      setPersons(initalPersons);
    });
  };
  useEffect(getAllPerson, []);

  const addPerson = (e) => {
    e.preventDefault();

    const person = {
      name: newName,
      number: newNumber,
      id: persons[0] ? persons.at(-1).id + 1 : 1,
    };

    if (person.name) {
      for (const same of persons) {
        if (person.name === same.name) {
          const updatedPerson = {
            ...person,
            id: same.id
          }
          window.confirm(`${person.name} is exist wanna change the number?`) && (
           personService.update(updatedPerson).then(getAllPerson)
          )
          setNewName("");
          setNewNumber("");
          return;
        }
      }

      personService.create(person).then((updatedPersons) => {
        setPersons(persons.concat(updatedPersons));
      });
    }
    setNewName("");
    setNewNumber("");
  };

  const filteredPerson = persons.filter((person) => {
    return person.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleChange = (input) => {
    const nameChange = (e) => setNewName(e.target.value);
    const numberChange = (e) => setNewNumber(e.target.value);
    const searchChange = (e) => setSearch(e.target.value);

    return input === "name"
      ? nameChange
      : input === "number"
      ? numberChange
      : searchChange;
  };

  const handleClick = (person) => () => {
    if (window.confirm(`Are you sure you want to Delete ${person.name} ?`)) {
      personService.deletePerson(person).then(getAllPerson);
    }
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
      {filteredPerson ? (
        <Persons persons={filteredPerson} handleClick={handleClick} />
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
