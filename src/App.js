import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import Form from './components/Form'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:3002/notes').then((response) => {
      setNotes(response.data)
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

    axios.post('http://localhost:3002/notes', noteObject).then((response) => {
      setNotes(notes.concat(noteObject))
      setNewNote('')
    })
  }

  const toggleImportance = (note) => {
    const changedNote = { ...note, important: !note.important }
    axios
      .put(`http://localhost:3002/notes/${note.id}`, changedNote)
      .then((response) => {
        setNotes(
          // Question: I want to replace the setNotes(*code*) to setNotes([]). And I expect React to reload the whole page since the state has changed, everything should re-render. Am I right?
          notes.map((x) => {
            if (x.id === note.id) {
              // I had problem here. I never return things damn
              return response.data
            } else {
              return x
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
    </div>
  )
}

export default App
