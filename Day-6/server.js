//server ko start karna
// imp : Database se connect karna
const app=require("./src/app")
const mongoose=require("mongoose")
function connectToDB(){
    mongoose.connect("mongodb+srv://vinayak:RuzHguXugMnYcFAi@cluster0.xn8d6uk.mongodb.net/Day-6")
    .then(()=>{
        console.log("Connected to Database")
    })
}
connectToDB()

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})