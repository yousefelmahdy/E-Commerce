const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {passwordValidator, emailValidator} = require("../validation")

// Register
router.post("/register", async (req,res)=>{

    // Check if valid email
    const result = emailValidator.validate(req.body.email);
    if (result.error) res.status(403).send("Invalid email");
    // Check if valid password
    const {error} = passwordValidator.validate(req.body.password);
    if (error) res.status(403).send("Invalid Password");

    let user = await User.findOne({email: req.body.email});
    if (user) {
        return res.status(400).send("Email already exist");
    }

    user = await User.findOne({username: req.body.username});
    if (user) {
        return res.status(400).send("Username is taken, try another one");
    }

    const hashPassword = await bcrypt.hash(req.body.password, parseInt(process.env.PASS_SEC));
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashPassword,
    });

try {
    await newUser.save();
    const {password, ...others} = newUser._doc;

    res.status(201).json(others);
} catch (err) {
    res.status(500).json(err);
}
    
});

// Login
router.post("/login", async(req,res)=>{

    // Check if valid email
    const result = emailValidator.validate(req.body.email);
    if (result.error) res.status(403).send("Invalid email");
    // Check if valid password
    const {error} = passwordValidator.validate(req.body.password);
    if (error) res.status(403).send("Invalid Password");

    // Check Valid email
    const user = await User.findOne({email: req.body.email});
    if (!user) res.status(400).json("Incorrect Email");
    // Check Valid password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) res.status(400).json("Incorrect Password");

    res.status(201).send("Login successfull")

});

module.exports = router;