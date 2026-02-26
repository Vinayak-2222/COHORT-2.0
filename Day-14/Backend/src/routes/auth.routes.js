const express=require('express');
const authRouter=express.Router();
const authController=require("../controller/auth.controller");
const identifyUser=require("../middlewares/auth.middleware");

//register route: POST /api/auth/register
//desc:to register a user
//acess:public
authRouter.post("/register",authController.registerController);

//login route: POST /api/auth/login
//desc:to login a user
//acess:public
authRouter.post("/login",authController.loginController);

//get-me route: GET /api/auth/get-me
//desc:to get the details of the logged in user
//acess:private
authRouter.get("/get-me",identifyUser,authController.getMeController);

module.exports=authRouter;