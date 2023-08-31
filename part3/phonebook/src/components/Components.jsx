const Filter = ({ search, handleChange }) => {
  return (
    <div>
      Search: <input value={search} onChange={handleChange} />
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

const Persons = ({ persons, handleClick }) => {
  return (
    <div>
      {persons
        ? persons.map((person) => (
            <p key={person.id}>
              {person.name} {person.number}
              <button key={person.id} onClick={handleClick(person)}>
                delete
              </button>
            </p>
          ))
        : ""}
    </div>
  );
};

const Notification = ({ message }) => {
  if (message) {
    if (message.content && message.stat === "error") {
      return <div className="error">{message.content}</div>;
    }
    if (message.content && message.stat === "success") {
      return <div className="success">{message.content}</div>;
    }
  }

  return;
};

export { PersonForm, Persons, Filter, Notification };
