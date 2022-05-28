const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req,res)=>{
    const hashPassword = await bcrypt.hash(req.body.password, parseInt(process.env.PASS_SEC));
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashPassword,
    });

try {
    await newUser.save();
    res.status(201).json(newUser);
} catch (err) {
    res.status(500).json(err);
}
    
});

module.exports = router;