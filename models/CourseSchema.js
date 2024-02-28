const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: String,
    courseDescription: String,
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    what_u_will_learn: String,
    coursecontent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        }
    ],
    ratingAndReviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReviews"
        }
    ],
    price: Number,
    thumbnail:{
        type: String
    },
    tag:{
        type: String,
        ref: "Tag"
    },
    studentsenrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }]
})

module.exports = mongoose.model("Course",courseSchema);