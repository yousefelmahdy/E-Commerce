const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username:{type: String, required: true, unique: true},
        email:{type: String, required: true, unique: true},
        passward:{type: String, required: true},
        isadmin:{type: Boolean, default: false},
    },
    {timestamps: true}
)

module.exports = mongoose.model("User", UserSchema); 