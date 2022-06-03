const router = require("express").Router();
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const verifyToken = require("../routes/verifyToken");
const { date } = require("joi");

router.post("/", verifyToken, async (req, res) => {
    if(!(req.user.isadmin)){
        return res.status(403).json("Access Denied!");
    }
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        return res.status(200).json(savedProduct);
    } catch (err) {
        return res.status(500).json(err);
    }
});








// UPDATE
router.put("/:id", verifyToken, async(req, res,)=>{
    if(!(req.user.isadmin)){
        return res.status(403).json("Access Denied!");
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },{new: true});
    res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }

});


//DELETE
router.delete("/:id", verifyToken, async(req, res,)=>{
    if(!(req.user.isadmin)){
        return res.status(403).json("Access Denied!");
    }

    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted ...");
    } catch (error) {
        res.status(500).json(error);
    }

});

//GET
router.get("/find/:id", async(req, res,)=>{

    try {
        const product = await Product.findById(req.params.id);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json(error);
    }

});

//GET ALL PRODUCTS
router.get("/", async(req, res,)=>{
    qNew = req.query.new;
    qCategory = req.query.category;
    try {
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(1);
        }else if(qCategory){
            products = await Product.find({
                catagories:{
                    $in: [qCategory]
            },
        });
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json(error);
    }

});

// //GET ALL USERS status
// router.get("/status", verifyToken, async(req, res,)=>{
//     if(!(req.user.isadmin)){
//         return res.status(403).json("Access Denied!");
//     }

//     const date = new Date();
//     const lastYear = new Date(date.setFullYear(date.getFullYear() -1));


//     try {
//         const date = await User.aggregate([
//             {$match : {createdAt : { $gte : lastYear }}},
//             {
//                 $project: {
//                     month : {$month : "$createdAt"},
//                 },
//             },
//             {
//                 $group: {
//                     _id: "$month",
//                     total:{ $sum : 1},
//                 }
//             }
//         ]);
//         res.status(200).json(date);
//     } catch (error) {
//         res.status(500).json(error);
//     }

// });



module.exports = router;