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
  const [errorMessage, setErrorMessage] = useState('some error....')

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes)
    })
  }, [])

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

  const toggleImportance = (note) => {
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(note.id, changedNote)
      .then((returnedNote) => {
        setNotes(
          // Question: I want to replace the setNotes(*code*) to setNotes([]). And I expect React to reload the whole page since the state has changed, everything should re-render. Am I right?
          notes.map((x) => {
            if (x.id === note.id) {
              // I had problem here. I never return things damn
              return returnedNote
            } else {
              return x
            }
          })
        )
      })
      // catch method was added but i don't why it is talking about deleting and that too in when we should be talking about updating. Can't just understand the lines after this
      .catch((error) => {
        setErrorMessage(
          `Note ${note.content} was already removed from the server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter((n) => n.id !== note.id))
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
            toggleImportance={() => toggleImportance(note)}
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
