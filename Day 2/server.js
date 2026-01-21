const express=require("express")
const app=express() //server instance created
app.get('/',(req,res)=>{
    res.send("hello vinayak")
})
app.get('/about',(req,res)=>{
    res.send("This is about homepage")
})
app.get('/home',(req,res)=>{
    res.send("This is homepage")

})
app.listen(3000) //server start karna
