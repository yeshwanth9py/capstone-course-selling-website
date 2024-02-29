const User = require("../models/User");
const otpGenerator = require("otp-generator");
const OTP = require("../models/Otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.sendotp = async (req, res)=>{
    const {email} = req.body;
    const checkuserpresent = await User.findOne({email});
    if(checkuserpresent){
        return res.status(401).json({
            success: false,
            msg: "user already found"
        })
    }

    // generate otp
    var otp = otpGenerator.generate(6,{
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    })
    let result = await OTP.findOne({otp: otp});

    while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        result = await otp.findOne({otp: otp});
    }

    const otpPayload = {email, otp};
    // create an entry for otp
    const otpbody = await OTP.create(otpPayload);

    // return resp successfully

    res.status(200).json({
        success: true,
        msg: "otp generate successfully"
    });

}

exports.signup = async (req, res)=>{
    // data fetch from req.body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmpassword,
        accounttype,
        contactnumber,
        otp
    } = req.body;

    // validate karlo
    if(!firstName || !lastName || !email || !password || !confirmpassword || !otp){
        return res.status(403).json({
            success: false,
            msg: "all details required"
        });
    }


    // 2 passwords match karlo
    if(password != confirmpassword){
        return res.status(403).json({
            success: false,
            msg: "passwords did not match"
        });
    }

    // check user already exists or not

    const user = await User.findOne({email});
    if(user){
        return res.status(401).json({
            success: false,
            msg: "user already found"
        })
    }

    // find most recent otp stored for user

    const recentOTP = await OTP.find({email}).sort({
        createdAt: -1
    }).limit(1);

    console.log(recentOTP);

    // validate otp

    if(recentOTP.length == 0){
        return res.status(401).json({
            success: false,
            msg: "otp not found"
        })
    }
    else if(otp !== recentOTP){
        return res.status(401).json({
            success: false,
            msg: "otp invalid"
        })
    }

    // hash passwords

    const hashedpassword = await bcrypt.hash(password, 10);

    // create an entry in db

    const profiledetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNo: null
    });

    const c_user = await User.create({
        firstName,
        lastName,
        email,
        contactNo,
        password: hashedpassword,
        accountType,
        additionalDetails: profiledetails._id,
        image: `https://api.dicebear/5.x/initials/svg?seed=${firstName} ${lastName}`
    });

    return res.status(200).json({
        msg: "user registered successfully"
    });
}


exports.login = async (req, res)=>{
    const {email, password} = req.body;

    // validate data
    if(!username || !password){
        res.status(403).json({
            success: falsw,
            msg:"all fields required"
        })
    }

    const user = await User.findOne({email}).populate("additionalDetails");

    if(!user){
        res.status(404).json({
            success: false,
            msg: "user did not found"
        })
    }

    // generate jwt , after password matching

    if(await bcrypt.compare(password,user.password)){
        const payload = {
            email: user.email,
            id: user._id,
            account: user.accountType
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h"
        });

        user.token = token;
        user.password = undefined;
        // create a cookie and send response
        const options = {
            expires: new Date(Date.now())+3*24*60*1000,
            httpOnly: true

        }

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            message: "logged in successfully"
        });
    } else{
        res.status(403).json({
            msg: "pasw is incorrect"
        })
    }
}


// HW change password







