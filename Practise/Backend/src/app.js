//server ko create karna and config karna
require('dotenv').config()
const express=require("express")
const app=express()
app.use(express.json())
const noteModel=require("./models/note.model")
const cors=require("cors")
app.use(cors())
//Post
app.post("/api/notes",async(req,res)=>{
    const{title,description}=req.body
    const note=await noteModel.create({
        title,description
    })
    res.status(201).json({
        message:"Note created Successfully",
        note
    })
    
})

//GET
app.get("/api/notes",async(req,res)=>{
    const notes=await noteModel.find()
    res.status(200).json({
        message:"Note fetched successfully",
        notes

    })
})

//Delete
app.delete("/api/notes/:id",async(req,res)=>{
    const id=req.params.id
     await noteModel.findByIdAndDelete(id)
     res.status(200).json({
        message:"note deleted successfully"
     })
})

//Patch
app.patch("/api/notes/:id",async(req,res)=>{
    const id=req.params.id
    const{description}=req.body
    await noteModel.findByIdAndUpdate(id,{description})
    res.status(200).json({
        message:"note updated successfully"
    })
})



module.exports=app