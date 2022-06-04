const router = require("express").Router();
const Order = require("../models/Order");
const verifyToken = require("../routes/verifyToken");
const { date } = require("joi");

// create
router.post("/", verifyToken, async (req, res) => {

    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        return res.status(200).json(savedOrder);
    } catch (err) {
        return res.status(500).json(err);
    }
});




// UPDATE
router.put("/:id", verifyToken, async(req, res)=>{
    if(!(req.user.isadmin)){
        return res.status(403).json("Access Denied!");
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate( req.params.id, {
            $set: req.body
        },{new: true});
    res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }

});


//DELETE
router.delete("/:id", verifyToken, async(req, res)=>{
    if(!(req.user.isadmin)){
        return res.status(403).json("Access Denied!");
    }

    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted ...");
    } catch (error) {
        res.status(500).json(error);
    }

});

//GET User's Orders
router.get("/find/:userId",verifyToken, async(req, res)=>{
    if(!(req.user._id == req.params.userId)){
        return res.status(403).json("Access Denied!");
    }

    try {
        const order = await Order.find({userId : req.params.userId});
        res.status(201).json(order);
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
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get monthly income
router.get("/",verifyToken, async(req, res)=>{
    if(!(req.user.isadmin)){
        return res.status(403).json("Access Denied!");
    }

    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1));
    const previousMonth = new Date(date.setMonth(date.getMonth() -2));

    try {
        const income = await Order.aggregate([
            {$match : {createdAt : { $gte : previousMonth, $lte : lastMonth }}},
            {
                $project: {
                    month : {$month : "$createdAt"},
                    amount : "$amount"
                },
            },
            {
                $group: {
                    _id : "$month",
                    total : {$sum : "$amount"},
                },
            },
        ]);
        res.status(200).json(income);
    } catch (error) {
        return res.status(500).json(error);
    }
});

module.exports = router;