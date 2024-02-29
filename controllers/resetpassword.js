const User = require("../models/User");
const crypto = require("crypto");
const mailsender = require("../utils/mailsender");


exports.resetPassword = async (req, res)=>{
    // get email from req.body
    const email = req.body.email;

    const user = await User.findOne({email: email});

    if(!user){
        res.json({
            msg: "email not found"
        })
    }

    // generate token
    const token = crypto.randomUUID();

    // update user by adding token and expiration time

    const updateddetails = await User.findOneAndUpdate({email: email}, {token: token,resetPassword: Date.now()+5*60*1000}, {new: true});

    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send mail containing the url

    await mailsender(email, "password rest link", `password rest link ${url}`);

    return res.json({
        msg: "email sent successfully"
    });


}

exports.resetPassword = async (req, res)=>{
    try{
        const {password, confirmPassword, token} = req.body;

    }
    catch(err){
        res.json(err);
        
    }
}