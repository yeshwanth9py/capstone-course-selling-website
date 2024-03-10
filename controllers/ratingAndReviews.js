exports.createRating = async (req, res)=>{
    try{
        const userId = req.user.id;

        const {rating, review, courseId} = req.body;

        // check if user is enrolled or not
        // const courseDetails = await Course.findOne({_id: courseId});

        // one way
        // const uid = new mongoose.Schema.Types.ObjectId(userId);
        // if(!courseDetails.studentsEnrolled.includes(uid)){
        //     return res.json({
        //         msg: "you are not registered in the course"
        //     })
        // }
        const courseDetails = await Course.findOne({_id: courseId, studentsEnrolled:{$elemMatch: {$eq: userId}}});

        if(!courseDetails){
            return res.json({
                msg: "course not found"
            })
        }



        // check if the user already reviewd the course
        const alreadyReviewed = await ratingAndReview.findOne({
            courseId,
            userId
        });

        // note: inorder to search in an db we can directly give the string object id by not coonverting
        // but when serching in an array we must convert it into mongoose.schema.types.ObjectId and the do arr.includes()


        // create rating and review
        const ratingReview = await ratingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId
        });


        // update the course with the rating and review
        await Course.findOneAndUpdate({id: courseId}, {$push:{
            ratingAndReview: ratingReview._id,
        }}, {new: true});

        return res.json({
            msg: "review added successfully"
        })

    } catch(err){
        return res.status(500).json({
            msg: "error adding review"
        })
    }
}


exports.getAverageRating = async (req, res)=>{
    try{
        const courseId = req.body.courseId;
        // cal avg rating
        const result = await ratingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Schema.Types.ObjectId(courseId);
                }
            },
            {
                $group:{
                    _id: null,
                    averageRating: {$avg:"$rating"}
                }
            }
        ])

        if(result.length>0){
            return res.json({
                rating: result[0].averageRating
            })
        } else{
            res.json({
                err: "no rating exist"
            })
        }



    } catch(err){
        res.json({
            err: "err obtaining avg  rating"
        })
    }
}


// get all ratings and reviews
exports.getAllRating = async (req, res)=>{
    try{
        const allReviews = await ratingAndReview.find({}).sort({rating:"desc"}).populate({
            path: "user",
            select: "firstName lastName email image"
        })
        .populate({
            path: "Course",
            select: "courseName"
        })
        .exec();

        return res.json({
            data: allReviews
        })
    } catch(err){
        return res.json({
            msg: "some error in getting reviews"
        })
    }
}



