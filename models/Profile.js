const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender: String,
    dateOfBirth: Date,
    about: String,
    contactNumber: Number
})

module.exports = mongoose.model("Profile",profileSchema);