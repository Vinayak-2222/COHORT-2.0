import {Router} from "express"
import {register,verifyEmail,login,getMe} from "../controllers/auth.controller.js"
import { registerValidator,loginValidator } from "../validator/auth.validator.js"
import { authUser } from "../middlewares/auth.middleware.js"




 const authRouter=Router()

 /**
  * @desc Register a new user
  * @route POST /api/auth/register
  * @access Public
  * @body { username, email, password }
  */
 authRouter.post("/register",registerValidator,register)

 /**
  * @route POST /api/auth/login
  * @desc Login user and return JWT token
  * @access Public
  * @body { email, password }
  */

authRouter.post("/login", loginValidator, login)

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */
authRouter.get('/get-me', authUser, getMe)


 authRouter.get("/verify-email",verifyEmail)

 export default authRouter