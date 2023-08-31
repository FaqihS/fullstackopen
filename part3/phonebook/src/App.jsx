import { useEffect, useState } from "react";
import {
  Filter,
  PersonForm,
  Persons,
  Notification,
} from "./components/Components";
import personService from "./service/phonebook";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  const [message, setMessage] = useState();

  const getAllPerson = () => {
    personService.getAll().then((initalPersons) => {
      setPersons(initalPersons);
    });
  };

  const theMessage = (content, stat) => () => {
    setMessage({
      content: content,
      stat: stat,
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
            id: same.id,
          };
          window.confirm(`${person.name} is exist wanna change the number?`) &&
            personService
              .update(updatedPerson)
              .then(theMessage(`'${person.name}' updated `, "success"))
              .catch( theMessage(`'${person.name}' was deleted already `, "error"))
              .finally(getAllPerson);
          setNewName("");
          setNewNumber("");
          return;
        }
      }

      personService
        .create(person)
        .then(theMessage(`'${person.name}' Added`, "success"))
        .catch(theMessage(`Cannot add to server`, "error"))
        .finally(getAllPerson);
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
      personService
        .deletePerson(person)
        .then(theMessage(`'${person.name}' is deleted`, "success"))
        .catch(theMessage(`${person.name} already deleted`, "error"))
        .finally(getAllPerson);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
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
