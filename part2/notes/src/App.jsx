import { useEffect, useState } from "react";
import noteService from "./services/note";
import "./index.css";

const Note = ({ note, toggleImportance }) => {
  const label = note.important ? "make not important" : "make important";
  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

const Notification = ({ message }) => {
  if (message == null) {
    return null;
  }
  return <div className="error">{message}</div>;
};
const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    noteService
      .getAll()
      .then((initialNote) => {
        setNotes(initialNote);
      })
      .catch(() => {
        setErrorMessage("Cannot get data from Server");
      });
  }, []);

  const notesToShow = showAll
    ? notes
    : notes.filter((n) => n.important === true);

  const addNote = (event) => {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      important: Math.random < 0.5,
      id: notes.length + 1,
    };

    noteService
      .create(noteObject)
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote));
        setNewNote("");
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  };
  const handleChange = (e) => {
    setNewNote(e.target.value);
  };

  const toggleImportanceOf = (id) => () => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNotes) => {
        setNotes(notes.map((n) => (n.id !== id ? n : returnedNotes)));
      })
      .catch(() => {
        setErrorMessage(`'${note.content}' is Deleted from server`)
        setNotes(notes.filter((note) => note.id !== id));
      });
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? "Important" : "All"}
      </button>
      <ul>
        {notesToShow.map((note) => (
          <Note
            note={note}
            key={note.id}
            toggleImportance={toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
