const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const verifyToken = require("../routes/verifyToken");
const { date } = require("joi");


// UPDATE
router.put("/:id", verifyToken, async(req, res)=>{
    if(!(req.user._id == req.params.id || req.user.isadmin)){
        return res.status(403).json("Access Denied!");
    }

    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, parseInt(process.env.PASS_SEC));
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new: true});
    res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }

});


//DELETE
router.delete("/:id", verifyToken, async(req, res)=>{
    if(!(req.user._id == req.params.id || req.user.isadmin)){
        return res.status(403).json("Access Denied!");
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted ...");
    } catch (error) {
        res.status(500).json(error);
    }

});

//GET
router.get("/find/:id", verifyToken, async(req, res)=>{
    if(!(req.user._id == req.params.id || req.user.isadmin)){
        return res.status(403).json("Access Denied!");
    }

    try {
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
        res.status(201).json(others);
    } catch (error) {
        res.status(500).json(error);
    }

});

//GET ALL USERS
router.get("/", verifyToken, async(req, res)=>{
    if(!(req.user.isadmin)){
        return res.status(403).json("Access Denied!");
    }

    try {
        const users = await User.find();
        res.status(201).json(users);
    } catch (error) {
        res.status(500).json(error);
    }

});

//GET ALL USERS status
router.get("/status", verifyToken, async(req, res)=>{
    if(!(req.user.isadmin)){
        return res.status(403).json("Access Denied!");
    }

    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));


    try {
        const date = await User.aggregate([
            {$match : {createdAt : { $gte : lastYear }}},
            {
                $project: {
                    month : {$month : "$createdAt"},
                },
            },
            {
                $group: {
                    _id: "$month",
                    total:{ $sum : 1},
                }
            }
        ]);
        res.status(200).json(date);
    } catch (error) {
        res.status(500).json(error);
    }

});



module.exports = router;