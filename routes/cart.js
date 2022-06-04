const router = require("express").Router();
const Cart = require("../models/Cart");
const verifyToken = require("../routes/verifyToken");


// create
router.post("/", verifyToken, async (req, res) => {

    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        return res.status(200).json(savedCart);
    } catch (err) {
        return res.status(500).json(err);
    }
});




// UPDATE
router.put("/:userId", verifyToken, async(req, res)=>{
    if(!(req.user._id == req.params.userId)){
        return res.status(403).json("Access Denied!");
    }

    try {
        const updatedCart = await Cart.findByIdAndUpdate({userId: req.params.userId}, {
            $set: req.body
        },{new: true});
    res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error);
    }

});


//DELETE
router.delete("/:id", verifyToken, async(req, res)=>{
    if(!(req.user._id == req.params.id)){
        return res.status(403).json("Access Denied!");
    }

    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted ...");
    } catch (error) {
        res.status(500).json(error);
    }

});

//GET User's cart
router.get("/find/:userId",verifyToken, async(req, res)=>{
    if(!(req.user._id == req.params.userId)){
        return res.status(403).json("Access Denied!");
    }

    try {
        const cart = await Cart.findById({userId : req.params.userId});
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }

});

// GET all carts
router.get("/", verifyToken, async(req, res)=>{
    if(!(req.user.isadmin)){
        return res.status(403).json("Access Denied!");
    }

    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;