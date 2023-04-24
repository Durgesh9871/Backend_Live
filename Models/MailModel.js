const mongoose = require("mongoose")

const mailScehma = mongoose.Schema({
    email:{type:String , require:true } ,
    messege:{type:String , require:true}
})


const mailModel = mongoose.Model("mail" , mailScehma)

module.exports = {
    mailModel
}