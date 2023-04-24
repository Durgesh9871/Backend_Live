require("dotenv").config();
const express = require("express")
const { connection } = require("./config/db");
const {userRouter} = require("./Routes/UserRoute")
const {mailRouter} = require("./Routes/MailRoute")

// cors 
const cors = require("cors")
const app = express()

// middle wares -----------------
app.use(cors())
app.use(express.json())


app.use("/users", userRouter);
app.use("/mail" , mailRouter)


app.get("/" , (req ,res)=>{
    res.send("HomePage of Bookxpert")
}) 



//connect to the server:-
app.listen(process.env.port, async () => {
    try {
      await connection;
      console.log("Connected to DB");
    } catch (err) {
      console.log(`Cannot connect to DB: ${err}`);
    }
    console.log(`Server is running on http://localhost:${process.env.port}`);
  });
  