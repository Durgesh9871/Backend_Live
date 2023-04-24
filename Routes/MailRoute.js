const express = require("express")
const mailModel = require("../Models/MailModel")


const mailRouter = express.Router()

// post req for messege -----------------
mailRouter.post("/" ,async(req ,res)=>{
    const {email , messege } = req.body 
    try{
        const mail = new mailModel({
            email ,
            messege ,
        })

        await mail.save()
        res.status(200).send("Mail Send")

    }
    catch(err){
        res.send(err)
    }
})



// get req for messege ------------
mailRouter.get("/" , async(req,res)=>{
    try{
     const messege = await mailModel.find()
     res.send(messege)
    }
    catch(err){
        res.send(err)
    }
})


module.exports = {
    mailRouter
}