const Note = ({ note, toggleImportance }) => {
  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportance}>
        {note.important ? 'Make Important' : 'Make Not Important'}
      </button>
    </li>
  )
}

export default Note
