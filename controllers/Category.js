exports.categoryPageDetails = async (req, res)=>{
    try{
        const {categoryId} = req.body;
        // get courses for the specified category
        const selectCategory = await Category.findById(categoryId).populate("courses").exec();

        // get courses for diff categories
        const differentCourse = await Category.find({_id: {$ne:categoryId}}).populate("courses").exec();

        return res.json({
            data: differentCourse,
            data2: selectCategory
        });
    } catch(err){
        res.json({
            msh: "err geteting courses using category"
        })
    }
}