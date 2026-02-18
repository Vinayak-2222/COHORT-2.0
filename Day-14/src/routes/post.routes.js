const express=require("express")
const postRouter=express.Router()
const PostController=require("../controller/post.controller")
const multer=require("multer")
const upload=multer({storage:multer.memoryStorage()})


postRouter.post("/",upload.single("image"),PostController.createPostController)

postRouter.get("/",PostController.getpostController)

postRouter.get("/details/:postId",PostController.getPostdetailsController)

module.exports=postRouter