const express=require("express")
const usermodel=require("../models/user.model")
const jwt=require("jsonwebtoken")
const crypto=require("crypto")

const authRouter=express.Router()  //we can create api other than app.js file
authRouter.post("/register",async(req,res)=>{
    const {name,email,password}=req.body
    const isUserAlreadyExists = await usermodel.findOne({email})
    if(isUserAlreadyExists){
        return res.status(409).json({
            message:"User already exists with this email address"
        })
    }

    const hash=crypto.createHash("md5").update(password).digest("hex")
    const user=await usermodel.create({
        name,email,password:hash
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

authRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const user=await usermodel.findOne({email})
    if(!user){
        return res.status(404).json({
            message:"User not found with this email address"
        })
    }

    const isPasswordMatched=user.password===crypto.createHash("md5").update(password).digest("hex")
    if(!isPasswordMatched){
        return res.status(401).json({
            message:"Invalid Password"
        })
    }

    const token=jwt.sign({
        id:user._id,

    },process.env.JWT_SECRET)

    res.cookie("jwt_token",token)

    res.status(200).json({
        message:"User logged in successfully",
        user
    })
})

module.exports=authRouter