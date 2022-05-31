const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (async (req, res, next) => {
    const token = req.headers.token;
    if (!token) return res.status(401).json("Access Denied!");
    
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user)=>{
        if(err) return res.status(403).json("Token is not valid");
        req.user = user;
        next();
    });
});
