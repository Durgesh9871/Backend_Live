const express = require("express");
const { UserModel } = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authenticate } = require("../Middlewares/AuthMiddleware");
// const { default: mongoose } = require("mongoose");



const userRouter = express.Router();


userRouter.get("/" , async(req,res)=>{
  try{
        const user = await UserModel.find()
        res.send(user)
  }
  catch(err){
    res.send('user are not getting')
  }
})

//register router
userRouter.post("/register", async (req, res) => {
  const { name, email, password,gender } = req.body;
  try {
    const alreadyUser = await UserModel.findOne({ email });
    if (alreadyUser) res.status(400).send("User already exist, please login");
    else {
      bcrypt.hash(
        password,
        Number(process.env.saltRounds),
        async (err, hash) => {
          if (hash) {
            const date = Date.now();
            const signUpTime = new Date(date);
            const user = new UserModel({
              name,
              email,
              gender,
              password: hash,
              signUpTime,
            });
            await user.save();
            res.status(200).send("Registered");
          } else {
            res.status(500).send(err);
          }
        }
      );
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//login router
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // check if email and password are present in the request body
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await UserModel.findOne({ email });
    
    // check if user exists in the database
    if (!user) {
      return res.status(404).send("User not found");
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ userID: user._id  } , process.env.secretKey);
        const date = Date.now();
        const loginTime = new Date(date);
        user.isActive = true;
        user.loginTime = loginTime;
        user.save();
        res.send({ msg: "Login Successfull", token: token });
        console.log(user);
      } else {
        res.status(401).send("Incorrect password");
      }
    });

  } catch (err) {
    res.status(500).send(err);
  }
});

//logout router
userRouter.get("/logout", authenticate, async (req, res) => {
  const { userID } = req.body;
  // mongoose.Types.ObjectId(userID)  ------- for converting string in mongo id ----------------
  try {
    if (userID) {
      const user = await UserModel.findOne({ _id: userID });
      const date = Date.now();
      const logoutTime = new Date(date);
      user.logoutTime = logoutTime;
      user.isActive = false;
      user.save();
      console.log(user);
      res.status(200).send(`User of ID: ${user._id} has been successfully logout`);
    } else {
      res.status(400).send(`Can't Logout :${err}`);
    }
  } catch (err) {
    res.status(500).send(`Can't Logout :${err}`);
  }
});




module.exports = {
  userRouter,
};
