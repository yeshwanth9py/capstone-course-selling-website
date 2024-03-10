const { default: mongoose } = require("mongoose");
const {instance} = require("../config/razorpay");
const Course = require("../models/CourseSchema");
const User = require("../models/User");
const mailsender = require("../utils/mailsender");
const crypto = require("crypto");
// const {courseEnrollmentMail} = require("../mail/templates/courseEnrollmentMail");


// capture the payment and initialize the order
exports.capturePayment = async (req, res)=>{
    // get courseid and userid
    const {courseId} = req.body;
    const userId = req.user.id;

    // validation
    if(!courseid){
        // write logic
    }

    let course;
    try{
        course = await Course.findById(courseId);
        if(!course){
            // write logic
        }
        
        // user already pay for the same course
        const uid = new mongoose.Schema.Types.ObjectId(userId);
        if(course.studentsenrolled.includes(uid)){
            return res.status(400).json({
                msg: "already registered"
            })
        }

        // create an order
        const amount = course.price;
        const currency = "INR";
        const options = {
            amount: amount*100,
            currency,
            reciept: Math.random(Date.now()).toString(),
            notes:{
                userId,
                courseId: course.id
            }
        }
         // initialize the payment using razorpay
         const paymentResponse = await instance.orders.create(options);
         console.log(paymentResponse);

         console.log(paymentResponse);

        

        
    } catch(err){
        return res.json({
            msg: "err creating order"
        })
    }

   
}


//  verify signature of razorpay and server
exports.verifySignature = async (req, res)=>{
    const webhooksecret = "12345678";
    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256",webhooksecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature == digest){
        console.log("payment is authorized");
        const {courseId, userId} = req.body.payload.payments.entity.notes;

        try{
            // fulfill the action
            // find the course and enroll the students in it

            const enrolledcourse = await Course.findOneAndUpdate({_id: courseId},
                {$push:{
                    studentsenrolled: userId
                }},{new: true});

            if(!enrolledcourse){
                return res.json({
                    msg: "err in fulfilling action"
                })
            }


            // find the student and add the course in courses enrolled
            const enrolledStudent = await User.findOneAndUpdate({
                _id: userId
            }, {$push: {courses: courseId}}, {new: true});

            // mail sent as a confirmation
            const emailResponse = await mailsender(`${enrollmentStudent.email}`, "chuthiya", "blablabla");
        } catch(err){
            return res.json({
                msg: "err in fulfilling action"
            })
        }
    }
}