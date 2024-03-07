const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res)=>{
    try{
        // data fetch
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                msg: "all details required"
            })
        }

        const newsection = await sectionName.create({sectionName});
        const updatedcourse = await Course.findByIdAndUpdate(courseId, {
            $push:{
                courseContent: newsection._id
            }
        },{new: true}
        );
        return res.json({
            msg: "success"
        })

    } catch(err){
        return res.status(400).json({
            msg: 
            "some error in creating section"
        });
    }
}

exports.updateSection = async (req, res)=>{
    const {sectionName, sectionId} = req.body;

    if(!sectionName || !sectionId){
        return res.status(400).json({
            msg: "all details required"
        })
    }

    const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new: true});

}


exports.deleteSection = async (req, res)=>{
    const {sectionId} = req.params;

    

    await Section.findByIdAndDelete(sectionId);
    return res.json({
        msg: "successfully deleted"
    })
}

