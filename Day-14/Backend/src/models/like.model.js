const mongoose=require("mongoose")
const { post } = require("../routes/user.routes")

const likeSchema=new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"posts",
        required:[true,"postId is required for creating a like"]
    },
    user:{
        type:String,
        required:[true,"user is required for creating a like"]  
    }
},{timestamps:true
})
likeSchema.index({postId:1,user:1},{unique:true})
const likeModel=mongoose.model("likes",likeSchema)
module.exports=likeModel;

