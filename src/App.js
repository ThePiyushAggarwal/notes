import { useState, useEffect } from 'react'
import Note from './components/Note'
import Form from './components/Form'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

  //
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date(),
      // this line sets a random true or false value to important
      important: Math.random() > 0.5,
    }

    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  const toggleImportance = (id, notee) => {
    let newNotee = { ...notee, important: !notee.important }
    noteService.update(id, newNotee).then((res) => {
      setNotes(
        notes.map((note) => {
          if (note.id === id) {
            return newNotee
          } else {
            return note
          }
        })
      )
    })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportance(note.id, note)}
          />
        ))}
      </ul>
      <Form
        handleNoteChange={handleNoteChange}
        addNote={addNote}
        newNote={newNote}
      />
      <Footer />
    </div>
  )
}

export default App
