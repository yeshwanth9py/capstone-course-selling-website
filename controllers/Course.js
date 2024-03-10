const { uploadImageToCloudinary } = require("../utils/imageuploader");

exports.createCourse = async (req, res)=>{
    const {coursename, coursedescription, whatyouwilllearn, price, tag} = req.body;

    const thumbnail = req.files.thumbnailimage;

    if(coursename || coursedescription || whatyouwilllearn || price || tag || thumbnail ){
        return res.status(404).json({
            msg: "all fields are reqd"
        })
    }

    const userid = req.user.id;
    const instructordetails = await UserActivation.findById(userid);
    if(!instructordetails){
        return res.status(404).json({
            msg: "err"
        });
    }

    const tagdetails = await Tag.findById(tag);
    if(!tagdetails){
        return res.status(404).json({
            msg: "tag not found"
        });
    }
     
    const thumbnailimage = await uploadImageToCloudinary(thumbnail, process.env.FolderName);

    const newcourse = await Course.create({
        coursename,
        coursedescription,
        Instructor: instructordetails._id,
        whatyouwilllearn,
        price,
        tag: tagdetails._id,
        thumbnail: thumbnailimage.secure_url
    });

    // add new course to the user schema of instructor
    await UserActivation.findByIdAndUpdate({_id: instructordetails._id},{
        $push:{
            course: newcourse._id,
        }
    }, {new: true})

};

exports.getallcourse = async (req, res)=>{
    const allcourse = await course.find({}).populate("instructor");
    res.json({
        msg: "success"
    })
};


exports.getallcoursedetails = async (req, res)=>{
    try{
        const {courseId} = req.body;
        // find the course details
        const coursedetails = await Course.find({_id: courseId}).populate({
            path:"instructor",
            populate:{
                path: "additionaldetails"
            }
        }).populate("category").populate("ratingAndReviews").populate({
            path: "courseContent",
            populate:{
                path: "subSection"
            }
        }).exec();

        // validation


    } catch(err){
        return res.json({
            msg: "err fetching course details"
        })
    }
}

