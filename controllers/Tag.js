const Tag = require("../models/Tags");
exports.createTag = async (req, res)=>{
    try{
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                msg: 'all detals are required'
            });
        }
        const tagdetails = await Tag.create({
            name: name,
            description: description
        });
        return res.json({
            msg: "tag created successfully"
        });

    } catch(err){
        return res.status(404).json({
            msg: "err"
        });
    }
}

exports.showalltags = async (req, res)=>{
    try{
        const alltags = await Tag.find({},{name:true, description:true});
        res.status(200).json({msg: "all tags fetched successfully"})
    } catch(err){
        return res.status(404).json({
            msg: "err"
        });
    }
}