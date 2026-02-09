const express=require("express")
const usermodel=require("../models/user.model")
const jwt=require("jsonwebtoken")

const authRouter=express.Router()  //we can create api other than app.js file
authRouter.post("/register",async(req,res)=>{
    const {name,email,password}=req.body
    const isUserAlreadyExists = await usermodel.findOne({email})
    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User already exists with this email address"
        })
    }
    const user=await usermodel.create({
        name,email,password
    })
    
    const token=jwt.sign(
        {
        id:user._id,
        email:user.email
        },
        process.env.JWT_SECRET
    )
    res.cookie("jwt_token",token)

    res.status(201).json({
        message:"User registered Successfully",
        user,
        token
    })
})


module.exports=authRouter