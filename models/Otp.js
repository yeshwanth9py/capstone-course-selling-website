const mongoose = require("mongoose");
const mailsender = require("../utils/mailsender");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 5*60
    }
});


async function sendverificationmail(email, otp){
    try{
        const mailResponse = await mailsender(email, "verification email from me", otp);
        console.log(mailResponse);
    }
    catch(err){
        console.log("err sending email",err);
        throw err;
    }
}

otpSchema.pre("save", async function(next){
    await mailsender(this.email, this.otp);
    next();
});


module.exports = mongoose.model("OTP",otpSchema);