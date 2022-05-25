const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");

dotenv.config();

mongoose.connect('mongodb://localhost/Ecommerce')
        .then(()=>console.log('connected successfully'))
        .catch(err=>console.log('could not connect....'));

app.use(express.json());
app.use("/api/users", userRouter)

const port = process.env.Port || 3000;
app.listen(port, () => console.log(`lisening on port ${port}`));

