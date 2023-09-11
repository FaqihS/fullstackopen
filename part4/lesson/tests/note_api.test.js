const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Note = require("../models/note");
const {initialNotes,nonExistingId,notesInDb} = require('./test_helper.js')

const api = supertest(app);


beforeEach(async () => {
  await Note.deleteMany({});

  for(note of initialNotes){
    let noteObject = new Note(note)
    await noteObject.save()
  }

  
});

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});


test("all notes returned", async () => {
  const response = await api.get("/api/notes");
  expect(response.body).toHaveLength(initialNotes.length);
});

test("the specific note is in the returned note", async () => {
  const response = await api.get("/api/notes");
  const contents = response.body.map((r) => r.content);
  expect(contents).toContain("Browser can execute only JavaScript");
});

test("a valid note can be added", async () => {
  const newNote = {
    content: "async/await simplifies making async calls",
    important: true,
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const notesAtEnd = await notesInDb()

  expect(notesAtEnd).toHaveLength(initialNotes.length + 1);
  const content = notesAtEnd.map(n => n.content)

  expect(content).toContain("async/await simplifies making async calls");
});

test('note with no content not added',async () => {
  const newNote = {
    important: true,
  }
  await api
  .post('/api/notes')
  .send(newNote)
  .expect(400)

  const notesAtEnd = await notesInDb()

  expect(notesAtEnd).toHaveLength(initialNotes.length)
})

test('specific note can be viewed',async () => {
  const notesAtStart = await notesInDb()

  const noteToView = notesAtStart[0]

  const resultNote = await api.get(`/api/notes/${noteToView.id}`)
  .expect(200)
  .expect('Content-Type',/application\/json/)

  expect(resultNote.body).toEqual(noteToView)
})

test('a note can be deleted',async () =>{
  const notesAtStart = await notesInDb()

  const noteToDelete = notesAtStart[0]

  await api.delete(`/api/notes/${noteToDelete.id}`)
  .expect(204)

  const noteAtEnd = await notesInDb()

  expect(noteAtEnd).toHaveLength(initialNotes.length -1)

  const content = noteAtEnd.map(n=>n.content)
  expect(content).not.toContain(noteToDelete.content)
})

test('note can be updated', async () => {
  const notesAtStart = await notesInDb()
  const noteToUpdate = notesAtStart[0]
  const newNote={
    content: 'newnote'
  }

  const updatedNote = await api.put(`/api/notes/${noteToUpdate.id}`)
  .send(newNote)
  .expect(200)
  .expect('Content-Type',/application\/json/)

  expect(updatedNote.body).not.toEqual(noteToUpdate)

  const noteAtEnd = await notesInDb()
  expect(noteAtEnd).toHaveLength(initialNotes.length)
})


afterAll(async () => {
  await mongoose.connection.close();
});
