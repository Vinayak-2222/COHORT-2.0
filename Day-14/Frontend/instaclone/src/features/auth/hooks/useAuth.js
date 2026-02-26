//hook layer will manage state and api layer and provide data to UI layer. It will use the AuthContext to manage user state and loading state, and will use the auth.api functions to perform login, register, and getMe operations. The useAuth hook will return the user, loading state, and the functions for login, register, and getMe.
import { useContext } from "react";
import { AuthContext } from "../auth.context";
import {login,register,getMe} from "../services/auth.api";

export const useAuth=()=>{
    const context=useContext(AuthContext);
    const {user,setUser,loading,setLoading}=context;

    const handleLogin=async(username,password)=>{
        setLoading(true);
        const response=await login(username,password);
        setUser(response.user);
        setLoading(false);
    }

    const handleRegister=async(username,email,password)=>{
        setLoading(true);
        const response=await register(username,email,password);
        setUser(response.user);
        setLoading(false);
    }
    return{
        user,
        loading,
        handleLogin,
        handleRegister
        
    }
}