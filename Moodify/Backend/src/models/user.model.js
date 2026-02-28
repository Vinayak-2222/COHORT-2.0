const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"], 
        unique:[true,"Username must be unique"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email must be unique"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    }
})

//userSchema.pre('save',async function(next){})
//userSchema.post('save',async function(next){})

const userModel=mongoose.model("User",userSchema)
module.exports=userModel