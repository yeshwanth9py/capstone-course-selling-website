const nodemailer = require("nodemailer");

const mailsender = async (email, title, body)=>{
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL,
            auth:{
                user: process.env.USER,
                pass: process.env.pass
            }
        })

        let info = await transporter.sendMail({
            from: "yeshwanthsai2008@gmail.com",
            to:`${email}`,
            subject: `${title}`,
            html:`${body}`
        });

        console.log(info);
        return info;
    }

    catch(err){
        res.json(err);
    }
}

module.exports = mailsender;