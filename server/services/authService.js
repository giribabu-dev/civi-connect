const { User } = require("../models/User");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendOtpToEmail(email, otp) {
    transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Login for Harassment & Injustice Reporting App",
        html: `
            <p>Below is the OTP for your login which will be valid for the next 5 mins</p>
            <h2>${otp}</h2>
        `
    })
}

const sendOtp = async (res, email) => {
    try {

        const user = await User.findOne({ email });

        const currentTimeStamp = parseInt(new Date().getTime() / 1000);
        const otpExpiry = currentTimeStamp + 300;

        if (user && user.otpExpiry && user.otpExpiry > currentTimeStamp) {
            return res.status(400).json({
                message: "OTP already sent"
            })
        }

        // If user is not exists
        // If user exists but otp is expired
        const otp = parseInt(Math.random() * 1000000)

        await sendOtpToEmail(email, otp)

        if (user) {
            user.otp = otp
            user.otpExpiry = otpExpiry
            await user.save()
            console.log("OTP sent to existing user", otp)
        }
        else {
            await User.create({
                email,
                otp,
                otpExpiry,
                createdAt: currentTimeStamp,
                updatedAt: currentTimeStamp
            });
            console.log("OTP sent to new user", otp)
        }

        return res.status(200).json({ message: "OTP sent successfully" })
    }
    catch (error) {
        console.log("An error occured while sending OTP", error.message)
        return res.status(500).json({ message: error.message })
    }
};

const verifyOtp = async (res, email, otp) => {
    try {

        const isUserExists = await User.findOne({ email });

        if (!isUserExists) {
            return res.status(404).json({ message: "User not found" });
        }
        else if (!isUserExists.otp) {
            return res.status(404).json({ message: "OTP not found!, Please send an OTP" });
        }

        const currentTimeStamp = parseInt(new Date().getTime() / 1000);
        if (currentTimeStamp > isUserExists.otpExpiry) {
            return res.status(410).json({ message: "OTP expired, Please send an OTP" });
        }

        if(isUserExists.otp !== otp){
            return res.status(400).json({message: "Invalid OTP"})
        }
    }
    catch (error) {

    }
};

module.exports = { sendOtp, verifyOtp };