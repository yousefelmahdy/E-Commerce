const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const authRouter = require("./routes/auth");

dotenv.config();
app.use(express.json());
app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/auth", authRouter)

mongoose.connect('mongodb://localhost:27017/ecommerce')
        .then(()=>console.log('connected successfully'))
        .catch(err=>console.log('could not connect....'));

const port = 4000;
app.listen(port, () => console.log(`lisening on port ${port}`));

