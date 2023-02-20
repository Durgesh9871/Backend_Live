const express = require("express")
const {PostModel} = require("../Models/Post.model")


const postRouter = express.Router()



postRouter.get("/", async(req, res)=>{
    const device = req.query.device
   
        if(device){
            try{
                const notes = await PostModel.find({device})
                res.send(notes) 
            }
            catch(err){
                console.log(err ,"err in find post")
            }
        }
        else{
            try{
                const notes = await PostModel.find()
                res.send(notes) 
            }
            catch(err){
                console.log(err ,"error in find post")
            }


        }
    
    
})


postRouter.get("/top",async(req,res)=>{
    let max = -Infinity 
    try{
        const notes = await PostModel.find().sort('no_if_comments')
        let data = notes[notes.length-1]
        res.send(data)
    }
    catch(err){
        console.log(err ,"err in getting the data")
    }
  
})









postRouter.post("/create" , async(req , res)=>{
    const payload = req.body 
    try{
        const new_note = new PostModel(payload)
        await new_note.save()
        res.send("created note")
    }
    catch(err){
      console.log(err)
      res.send("something went wrong")
    }

})



postRouter.patch("/update/:id" , async(req,res)=>{
    const payload = req.body 
    const id = req.params.id 
    const note = await PostModel.findOne({"_id":id})
    const userID_In_Post = note.userID
    const userID_making_req = req.body.userID

   try{
    if(userID_making_req != userID_In_Post){
        res.send({"msg":"Not authorized"})
    }
    else{
            await PostModel.findByIdAndUpdate({"_id":id} , payload)
            res.send("update the note")
        }
    }

    catch(err){
     res.send("error in update" , err)
    }
})



postRouter.delete("/delete/:id" , async(req,res)=>{
    const id = req.params.id 
    const note = await PostModel.findOne({"_id":id})
    const userID_In_Post = note.userID
    console.log(note)
    const userID_making_req = req.body.userID
    try{
        if(userID_making_req != userID_In_Post){
            res.send({"msg":"Not authorized"})
        }
        else{
            await PostModel.findByIdAndDelete({"_id":id})
            res.send("Delte the note")
        }
    }
            
        catch(err){
         console.log(err)
         res.send("something went wrong in delte")
        }
})




module.exports={
    postRouter
}