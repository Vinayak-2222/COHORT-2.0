const express=require("express")
const postRouter=express.Router()
const PostController=require("../controller/post.controller")
const multer=require("multer")
const upload=multer({storage:multer.memoryStorage()})
const identifyUser=require("../middlewares/auth.middleware")

//POST /api/posts/
//{req.body}=[caption,image-file]
postRouter.post("/",upload.single("image"),identifyUser,PostController.createPostController)

//GET /api/posts/ [protected]
postRouter.get("/",identifyUser,PostController.getpostController)

//GET /api/posts/details/:postID
postRouter.get("/details/:postId",identifyUser,PostController.getPostdetailsController)

//POST /api/posts/like/:postId
postRouter.post("/like/:postId",identifyUser,PostController.likePostController)

module.exports=postRouter