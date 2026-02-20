const postModel=require("../models/post.model")
const Imagekit=require("@imagekit/nodejs")
const{toFile}=require("@imagekit/nodejs")
const jwt=require("jsonwebtoken")
const usermodel = require("../models/user.model")
const likeModel=require("../models/like.model")

const imagekit=new Imagekit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})


async function createPostController(req,res){
   

   

    const file= await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer),'file'),
        fileName:"Test",
        folder: "/myposts"

    })
    const post=await postModel.create({
        caption:req.body.caption,
        imgUrl:file.url,
        user:req.user.id
    })
    res.status(201).json({
        message:"post created successfully",
        post
    })
    
}

async function getpostController(req,res){
    
    const userId=req.user.id
    const posts=await postModel.find({
        user:userId
    })
    res.status(200).json({
        message:"post fetched successfully",
        posts
    })

}

async function getPostdetailsController(req,res){

    const { postId } = req.params
    const userId = req.user.id
    const post=await postModel.findById(postId)
    if (!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }
    
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

async function likePostController(req,res){
    const username=req.user.username
    const postId  = req.params.postId
    const post=await postModel.findById(postId)
    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }
    const like=await likeModel.create({
        postId,
        user:username
    })
    res.status(201).json({
        message:"Post liked successfully",
        like
    })
}

module.exports={
    createPostController,
    getpostController,
    getPostdetailsController,
    likePostController
}