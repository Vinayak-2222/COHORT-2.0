const postModel=require("../models/post.model")
const Imagekit=require("@imagekit/nodejs")
const{toFile}=require("@imagekit/nodejs")
const jwt=require("jsonwebtoken")
const usermodel = require("../models/user.model")

const imagekit=new Imagekit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})


async function createPostController(req,res){
    console.log(req.body,req.file)

    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Token not provided, unauthorized"})
    }
    let decoded=null;
    try{
         decoded=jwt.verify(token,process.env.JWT_SECRET)
    }
    catch(err){
        return res.status(401).json({message:"User not authorized"})
    }
    
    console.log(decoded)

    const file= await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer),'file'),
        fileName:"Test",
        folder: "/myposts"

    })
    const post=await postModel.create({
        caption:req.body.caption,
        imgUrl:file.url,
        user:decoded.id
    })
    res.status(201).json({
        message:"post created successfully",
        post
    })
    
}

async function getpostController(req,res){
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"Unauthrorized Token"
        })
    }
    let decoded;
    try{
        decoded=jwt.verify(token,process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({
            message:"Token INVALID"
        })
    }
    const userId=decoded.id
    const posts=await postModel.find({
        user:userId
    })
    res.status(200).json({
        message:"post fetched successfully",
        posts
    })

}

async function getPostdetailsController(req,res){
    const token =req.cookies.token
    const { postId } = req.params
    if(!token){
        return res.status(401).json({
            message:"Unauthrorized Token"
        })
    }
    let decoded;
    try{
        decoded=jwt.verify(token,process.env.JWT_SECRET)
    }catch(err){
        return res.status(401).json({
            message:"Invalid token"
        })
    }
    const post=await postModel.findById(postId)
    if (!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }
    const userId = decoded.id
    const isValidUser=post.user.toString()===userId
    if(!isValidUser){
        return res.status(403).json({
            message:"Forbidden content"
        })
    }
    return res.status(200).json({
        message:"Post fetched successfully",
        post
    })

}

module.exports={
    createPostController,
    getpostController,
    getPostdetailsController
}