// API layer to communicate with backend for auth related operations
//axios is used to make HTTP requests to the backend API. We create an instance of axios with a base URL and set withCredentials to true to allow sending cookies with requests. The login, register, and getMe functions are defined to make POST and GET requests to the respective endpoints and return the response data.
import axios from "axios";
const api=axios.create({
    baseURL:"http://localhost:3000/api/auth",
    withCredentials:true // to send cookies with requests
})


 export async function login(username,password){
    const response=await api.post("/login",{username,password});
    return response.data;
}
export async function register(username,email,password){
    const response=await api.post("/register",{username,email,password});
    return response.data;
}
export async function getMe(){
    const response=await api.get("/get-me");
    return response.data;
}