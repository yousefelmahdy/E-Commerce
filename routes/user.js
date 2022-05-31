const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const verifyToken = require("../routes/verifyToken");

router.put("/:id", verifyToken, async(req, res,)=>{
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
        return res.status(500).json(error);
    }

});


module.exports = router;