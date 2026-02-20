const express=require("express")
const userRouter=express.Router()
const userController=require("../controller/user.controller")
const identifyUser = require("../middlewares/auth.middleware")

//POST /api/users/follow/:username
userRouter.post("/follow/:username",identifyUser,userController.followUserController)

//POST /api/users/unfollow/:username
userRouter.post("/unfollow/:username",identifyUser,userController.unfollowUserController)


module.exports=userRouter