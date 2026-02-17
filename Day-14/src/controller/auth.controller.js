const crypto=require('crypto');
const jwt=require('jsonwebtoken');
const usermodel=require("../models/user.model");

async function registerController(req,res){
    const {username,email,password,bio,profileImage}=req.body;
    const isuserAlreadyExists=await usermodel.findOne({$or:[{email},{username}]});
    if(isuserAlreadyExists){
        return res.status(409).json({message:"user already exists" + (isuserAlreadyExists.email===email?" email already exists":" username already exists")});
    }
    const hash=crypto.createHash("sha256").update(password).digest("hex");
    const user=await usermodel.create({username,email,password:hash,bio,profileImage});
    const token=jwt.sign({
        id:user._id,

    },process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie("token",token)
    res.status(201).json({
        message:"user registered successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })
}

async function loginController(req,res){
    const {email,password,username}=req.body;
    const user=await usermodel.findOne({$or:[{email:email},{username:username}]});
    if(!user){
        return res.status(404).json({message:"user not found"});
    }
    const hash=crypto.createHash("sha256").update(password).digest("hex");
    const isPasswordCorrect=hash===user.password;
    if(!isPasswordCorrect){
        return res.status(401).json({message:"invalid password"});
    }
    const token=jwt.sign({
        id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie("token",token)
    res.status(200).json({
        message:"user logged in successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })
}

module.exports={registerController,loginController};