// server create and config
const express=require("express")
const app=express() //server instance creation
app.use(express.json()) //middleware
//notes array
const notes=[]

// POST METHOD : /notes API
app.post("/notes",(req,res)=>{
    console.log(req.body)
    notes.push(req.body)
    console.log(notes)
    res.send("notes created")
})

// GET : /notes API
app.get("/notes",(req,res)=>{
    res.send(notes)
})

//DELETE : /notes/:index
app.delete("/notes/:index",(req,res)=>{
    delete notes[req.params.index]
    res.send("note deleted succesfully")
})

//PATCH : /notes/:index
//req.body ={description :- "sample modified description"}
app.patch("/notes/:index",(req,res)=>{
    notes[req.params.index].description =req.body.description
    res.send("notes updated successfully")
})
module.exports=app