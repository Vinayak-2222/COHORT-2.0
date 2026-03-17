import { Router } from "express";
import { registerUser } from "../controller/auth.controller.js";
import { registerValidation } from "../validation/auth.validator.js";
const authRouter=Router()

// /api/auth/register
authRouter.post("/register",registerValidation,registerUser)

export default authRouter