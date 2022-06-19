const Note = ({ note, toggleImportance }) => {
  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportance}>
        {note.important ? 'Make Not Important' : 'Make Important'}
      </button>
    </li>
  )
}

export default Note
