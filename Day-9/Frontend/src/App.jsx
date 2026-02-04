import { useState,useEffect } from 'react'
import axios from 'axios'

function App() {
  const [notes, setnotes] = useState([])
  //console.log("hello integration")


  function fetchNotes(){
    axios.get('http://localhost:3000/api/notes')
  .then((res)=>{
  setnotes(res.data.notes)
  })
 }
  useEffect(()=>{
    fetchNotes()
 },[])

 function handleSubmit(e){
  e.preventDefault()
  const{title,description}=e.target.elements
  console.log(title.value,description.value)
  axios.post("http://localhost:3000/api/notes",{
    title:title.value,
    description:description.value
  })
  .then(res=>{
    console.log(res.data)
    fetchNotes()
  })

 }
 function handleDelete(noteId){
  axios.delete("http://localhost:3000/api/notes/"+noteId)
  .then(res=>{
    console.log(res.data)
    fetchNotes()
  })
 }
 
 function handleUpdate(noteId){
  const newDescription=prompt("Enter new Description")
  axios.patch("http://localhost:3000/api/notes/"+noteId,{
    description:newDescription
  })
  .then(res=>{
    console.log(res.data)
    fetchNotes()
  })

 }
  

  return (
    <>
    <form className='note-create-form' onSubmit={handleSubmit}>
      <input name='title' type="text" placeholder='Enter Title'/>
      <input name='description' type="text"  placeholder='Enter Description'/>
      <button>Create Note</button>
    </form>
    <div className="notes">
      {notes.map(note =>{
        return <div className="note">
        <h1>{note.title}</h1>
        <p>{note.description}</p>
        <div className="note-actions">
  <button
    className="delete-btn"
    onClick={() => handleDelete(note._id)}
  >
    Delete
  </button>

  <button
    className="update-btn"
    onClick={() => handleUpdate(note._id)}
  >
    Update
  </button>
</div>

      </div>
      }) 
    }
    </div>
    </>
  )
}

export default App
