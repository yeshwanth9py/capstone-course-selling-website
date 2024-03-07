const mongoose = require("mongoose");

const sectionschema = new mongoose.model({
    sectionName: String,
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }
});

module.exports = sectionschema;
