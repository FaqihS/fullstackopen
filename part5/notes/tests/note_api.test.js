const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const { initialNotes, nonExistingId, notesInDb } = require('./test_helper.js')

const api = supertest(app)

beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(initialNotes)

})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes returned', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('the specific note is in the returned note', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map((r) => r.content)
    expect(contents).toContain('Browser can execute only JavaScript')
  })
})

describe('viewing specific note', () => {
  test('succeeds with valid id', async () => {
    const notesAtStart = await notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultNote.body).toEqual(noteToView)
  })

  test('fails with 404 if does not exist', async () => {
    const validNonExistId = await nonExistingId()

    await api.get(`/api/notes/${validNonExistId}`).expect(404)
  })

  test('fails with 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api.get(`/api/notes/${invalidId}`).expect(400)
  })
})

describe('addition of new note', () => {
  test('succeeds with valid data', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await notesInDb()

    expect(notesAtEnd).toHaveLength(initialNotes.length + 1)
    const content = notesAtEnd.map((n) => n.content)

    expect(content).toContain('async/await simplifies making async calls')
  })

  test('fails with 404 with invalid data', async () => {
    const newNote = {
      important: true,
    }
    await api.post('/api/notes').send(newNote).expect(400)

    const notesAtEnd = await notesInDb()

    expect(notesAtEnd).toHaveLength(initialNotes.length)
  })
})

describe('deletion of the note', () => {
  test('succeeds with 204 if id valid', async () => {
    const notesAtStart = await notesInDb()

    const noteToDelete = notesAtStart[0]

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

    const noteAtEnd = await notesInDb()

    expect(noteAtEnd).toHaveLength(initialNotes.length - 1)

    const content = noteAtEnd.map((n) => n.content)
    expect(content).not.toContain(noteToDelete.content)
  })
})

describe('updating a notes', () => {
  test('succeeds with proper content and id', async () => {
    const notesAtStart = await notesInDb()
    const noteToUpdate = notesAtStart[0]
    const newNote = {
      content: 'newnote',
    }

    const updatedNote = await api
      .put(`/api/notes/${noteToUpdate.id}`)
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(updatedNote.body).not.toEqual(noteToUpdate)

    const noteAtEnd = await notesInDb()
    expect(noteAtEnd).toHaveLength(initialNotes.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
