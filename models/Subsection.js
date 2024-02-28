const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
    title: String,
    timeDuration: String,
    videoURL: String,
    description: String
})

module.exports = mongoose.model("subsection",SubSectionSchema );