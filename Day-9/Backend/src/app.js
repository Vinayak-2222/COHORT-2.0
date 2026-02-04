//server ko create karna
//config karna
require('dotenv').config()
const express=require("express")
const noteModel=require("./models/note.model")
const cors=require("cors")
const path =require("path")


const app =express()


app.use(express.json())
app.use(cors())
app.use(express.static("./public")) //this makes public folder available for public
//POST METHOD /api/notes   create a new note and store in mongodb  req.body={title,description}
app.post("/api/notes",async(req,res)=>{
    const{title,description}=req.body
     const note= await noteModel.create({
        title,description
    })
    res.status(201).json({
        message:"Note created successfully",
        note
    })
})

//GET
app.get("/api/notes",async (req,res)=>{
    const notes= await noteModel.find()
    res.status(200).json({
        message:"Notes fetched successfully",
        notes
    })
})

//Delete
app.delete("/api/notes/:id",async(req,res)=>{
    const id=req.params.id
     await noteModel.findByIdAndDelete(id)
     res.status(200).json({
        message:"Note deleted successfully"
     })
})

//Patch
app.patch("/api/notes/:id",async(req,res)=>{
    const id=req.params.id
    const {description}=req.body
    await noteModel.findByIdAndUpdate(id,{description})
    res.status(200).json({
        message:"Note updated successfully"
    })
})


app.use('*name',(req,res)=>{
    res.sendFile(path.join(__dirname,"..","/public/index.html"))
})

module.exports=app