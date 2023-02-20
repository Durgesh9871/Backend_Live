
const express = require("express")
const {connection} = require("./configs/db")
const {userRouter} = require("./routes/user.routes")
const {postRouter} = require("./routes/post.routes")
const {authenticate} = require("./Middlewares/authenticate")

const cors = require("cors")

const app = express()
app.use(cors({
    origin:"*"
}))

app.use(express.json())


app.get("/" , (req,res)=>{
    res.send("This is home page")
})



app.use("/users" , userRouter)
app.use(authenticate)
app.use("/posts" , postRouter)



app.listen(4500 , async(req , res)=>{
    try{
        await connection 
        console.log("connected to db on port 4500")
    }
    catch(err){
       console.log(err , "trouble in connecting")
    }
        
})