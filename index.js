const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
require("dotenv").config();
const cors=require("cors");
const authRouter=require("./routes/userRoutes");
const booksRouter = require('./routes/bookRoutes');

const app=express();
const PORT=process.env.PORT|| 5000;
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/books",booksRouter);
const DATABASE_URL=process.env.DATABASE_URL;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(DATABASE_URL).then(()=>{
    console.log("MONGO DB CONNECTED SUCCESSFULLY");
   
})
.catch(error=>{
    console.error("Mongodb connection error",error);
    process.exit(1);
})


app.listen(PORT,()=>{
    console.log(`Server running on port:${PORT}`);

})


