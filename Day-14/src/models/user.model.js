const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"username already exists"],
        required:[true,"username is required"]
    },
    email:{
        type:String,
        unique:[true,"email already exists"],
        required:[true,"email is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    bio:String,
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/quzbeaduo/default-avatar-profile-icon-social-600nw-1906669723.webp"
    }
});

const usermodel=mongoose.model("users",userSchema);
module.exports=usermodel;