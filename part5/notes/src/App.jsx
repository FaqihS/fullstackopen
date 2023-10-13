import { useEffect, useRef, useState } from "react";
import noteService from "./services/note";
import "./index.css";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import NoteForm from "./components/NoteForm";
import Note from "./components/Note";

const Notification = ({ message }) => {
  if (message == null) {
    return null;
  }
  return <div className="error">{message}</div>;
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState();

  const noteFormRef = useRef()

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

  const addNote = async (noteObject) => {
    noteFormRef.current.toggleVisibility()
    try {
      const note = await noteService.create(noteObject, user.token);
      setNotes(notes.concat(note));
    } catch {
      setErrorMessage("Cannot Add note");
      setTimeout(() => {
        setErrorMessage(null);
      }, 1000);
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
      noteService.setToken(userLogin.token);
      setUsername("");
      setPassword("");
    } catch (err) {
      setErrorMessage("wrong credential");
      setTimeout(() => {
        setErrorMessage(null);
      }, 1000);
    }
  };
  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const toggleImportanceOf = (id) => async () => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    try {
      const noteToUpdate = await noteService.update(id, changedNote);
      setNotes(notes.map((n) => (n.id !== id ? n : noteToUpdate)));
    } catch {
      setErrorMessage(`'${note.content}' is Deleted from Server`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 1000);
    }
  };

  const Notes = () => (
    <ul>
      {notesToShow.map((note) => (
        <Note
          note={note}
          key={note.id}
          toggleImportance={toggleImportanceOf(note.id)}
        />
      ))}
    </ul>
  );

  const noteForm = () => (
    <Togglable buttonLabel="New Note" ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  );

  const loginForm = () => {
    return (
      <Togglable buttonLabel="Login">
        <LoginForm
          handleLogin={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </Togglable>
    );
  };

  const userForm = () => (
        <div>
          <p>{user.name}</p>
          <button onClick={handleLogout}>Logout</button>
          {noteForm()}
        </div>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user ? userForm() : loginForm()  }
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "Important" : "All"}
        </button>
        <Notes />
    </div>
  );
};

export default App;
