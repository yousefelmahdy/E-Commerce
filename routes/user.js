const router = require("express").Router();

router.get("/usertest" , (req,res)=>{
    res.send("done");
});

router.post("/username", (req,res)=>{
    const username = req.body.username;
    res.send("my name is : "+ username);
});

module.exports = router;