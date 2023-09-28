import { useEffect, useState } from "react";
import noteService from "./services/note";
import "./index.css";
import loginService from "./services/login";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const intialNotes = await noteService.getAll();
        setNotes(intialNotes);
      } catch {
        setErrorMessage("cannot get data from server");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const notesToShow = showAll
    ? notes
    : notes.filter((n) => n.important === true);

  const addNote = async (event) => {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      important: Math.random < 0.5,
      id: notes.length + 1,
    };

    try {
      const note = await noteService.create(noteObject, user.token);
      setNotes(notes.concat(note));
    } catch (e) {
      setErrorMessage(e);
    } finally {
      setNewNote("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userLogin = await loginService({ username, password });

      window.localStorage.setItem(
        "loggedNoteAppUser",
        JSON.stringify(userLogin)
      );

      setUser(userLogin);
      setUsername("");
      setPassword("");
    } catch (err) {
      setErrorMessage("wrong credential");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };
  const handleChange = (e) => {
    setNewNote(e.target.value);
  };

  const toggleImportanceOf = (id) => async () => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    try {
      const noteToUpdate = await noteService.update(id, changedNote);
      setNotes(notes.map((n) => (n.id !== id ? n : noteToUpdate)));
    } catch (e) {
      setErrorMessage(`'${note.content}' is Deleted from Server`);
    }
  };

  const LoginForm = () => (
    <form onSubmit={handleLogin}>
      username
      <input
        type="text"
        name="username"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      password
      <input
        type="password"
        name="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <button type="submit">login</button>
    </form>
  );

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleChange} />
      <button type="submit">save</button>
    </form>
  );

  return (
    <div>
      <h1>Notes</h1>
      {!user && LoginForm()}
      {user && (
        <div>
          <p>{user.name}</p>
          <button onClick={handleLogout}>Logout</button>
          {noteForm()}
        </div>
      )}
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
    </div>
  );
};

export default App;
