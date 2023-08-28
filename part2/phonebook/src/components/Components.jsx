
const Filter = ({ search, handleChange }) => {
  return (
    <div>
      Search:{" "}
      <input type="search" value={search} onChange={handleChange} />
    </div>
  );
};

const PersonForm = ({ handleSubmit, name, number, handleChange }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        Name: <input value={name} onChange={handleChange("name")} />
      </div>
      <div>

        Number:{" "}
        <input type="tel" value={number} onChange={handleChange("number")} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
        </p>
      ))}
    </div>
  );
};

export {PersonForm,Persons,Filter}
