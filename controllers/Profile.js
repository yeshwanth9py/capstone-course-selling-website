exports.updateProfile = async (req, res)=>{
    try{
        const {dateofbirth="",about="",contactnumber, gender} = req.body;
        const id = req.user.id;

        if(!contactnumber || !gender){
            res.status(404).json({
                msg: "all details reqd"
            })
        }
        const userdetails = await User.findById(id);
        const profileID = userdetails.additiondetails;
        const profiledetails = await profileID.findById(profileID);

        // update profile
        profiledetails.dateofbirth = dateofbirth;
        profiledetails.about = about;
        profiledetails.gender = gender;
        profiledetails.contactnumber = contactnumber;
        await profiledetails.save();
        return res.json({
            msg: "success"
        })
    } catch(err){
        return res.status(404).json({
            msg: "error in updating profile"
        })
    }
}

exports.deleteProfile = async (req, res)=>{
    try{
        const id = req.user.id;

        const userdetails = await User.findById(id);
        

        await Profile.findByIdAndDelete({_id:userdetails.additiondetails});
        return res.json({
            msg: "success"
        })
    } catch(err){
        return res.status(404).json({
            msg: "error in deleting profile"
        })
    }
}


exports.getalluserdetails = async (req, res)=>{
    try{
        const id = req.user.id;

        const userdetails = await User.findById(id).populate("additionaldetails");
        

        
        return res.json({
            msg: "success",
            userdetails
        });
    } catch(err){
        return res.status(404).json({
            msg: "error in deleting profile"
        })
    }
}