const { Schema, model } = require("mongoose");
const { emailRegex } = require("../utils/regex");

const USER_ROLES = {
    ADMIN: "ADMIN",
    CITIZEN: "CITIZEN"
};

const userSchema = new Schema({
    fullName: String,
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: (value) => {
                return emailRegex.test(value)
            },
            message: "Invalid email"
        }
    },
    otp: Number,
    role: {
        type: String,
        enum: [USER_ROLES.ADMIN, USER_ROLES.CITIZEN],
        default: USER_ROLES.CITIZEN
    },
    otpExpiry: Number,
    createdAt: Number,
    updatedAt: Number
});

const User = model("User", userSchema);
module.exports = { User }