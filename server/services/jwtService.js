const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function generateToken(claims) {
    return jwt.sign(claims, process.env.JWT_SECRET_KEY, { expiresIn: "5Mins" });
};

module.exports = { generateToken };