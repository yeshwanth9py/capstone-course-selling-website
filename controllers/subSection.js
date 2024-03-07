exports.createsubsection = async (req, res)=>{
    try{
        const {sectionId, title, timeduration, description} = req.body;
        // validation
        if(!sectionId || !title || !timeduration || !description){
            return res.status(400).json({
                msg: "all fields required"
            });
        }

        const uploaddetails = await uploadImageToCloudinary(video, process.env.FolderName);

        const subsectiondetails = await Subsection.create({
            title,
            timeduration,
            description,
            videoUrl: uploaddetails.secureURL
        });

        const Sectiondetails = await Section.findByIdAndUpdate({id: sectionId},{$push:{
            Subsection: subsectiondetails._id
        }}, {new: true});

        return res.json({
            msg: "successfully created subsection"
        });

    } catch(err){
        return res.status(404).json({
            msg: "err"
        });
    }
}

