const express = require("express")
const {UserModel} = require("../Models/User.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const userRouter = express.Router()

userRouter.post("/register" , async (req,res)=>{
    const {email , pass , name , gender , age ,city} = req.body
    const userdata = await UserModel.find({email}) 
    if(userdata.length == 0){
    try{
        bcrypt.hash(pass , 5 , async(err , secure_password) => {
             if(err){
                console.log(err)
                res.send(err)
             }
             else{
                const user = new UserModel({email,pass:secure_password , name , gender ,age , city})
                await user.save()
                res.send({"msg":"registered"})

             }
        })
    }
    catch(err){
        res.send({"msg":"error in registering user"})
        console.log(err)
    }
}
else{
    res.send("User already exist, please login")
}
})



userRouter.post("/login" , async(req , res)=>{
    const {email , pass} = req.body 
    console.log(email , pass)
    try{
        const user = await UserModel.find({email})
        const hashed_pass = user[0].pass
        if(user.length > 0 ){
            bcrypt.compare(pass , hashed_pass , (err , result)=>{
                if(result){
                    const token = jwt.sign({userID:user[0]._id} , "masai")
                    res.send({"msg":"Login Successfull" , "token":token})
                }
                else{
                    res.send("wrong credentials")
                }
            })
        }
        else{
            res.send({"msg":"wrong credentials"})
        }
    }
    catch(err){
        res.send("error in login")
    }
})




module.exports = {
    userRouter
}