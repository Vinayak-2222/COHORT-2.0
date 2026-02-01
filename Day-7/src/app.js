//server ko create karna
const express=require("express")
const app=express()
const noteModel=require("./models/notes.model")
app.use(express.json())

//method:POST api:/notes
//req.body => {title,description}
app.post("/notes",async (req,res)=>{
    const {title,description}=req.body
    const notes =await noteModel.create({
        title,description
    })
    res.status(201).json({
        message:"Note created successfully",
        notes
    })
})
//method:GET api:/notes
//fetch all notes data
app.get("/notes",async(req,res)=>{
    const notes= await noteModel.find()
    res.status(200).json({
        message:"Note fetched Successfully",
        notes
    })
})


module.exports=app
