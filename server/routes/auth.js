const { Router } = require("express");
const { emailRegex } = require("../utils/regex");
const { sendOtp } = require("../services/authService");

const router = Router();

router.post("/otp/send", async (req, res) => {

    const { email } = req.body;

    try {

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        sendOtp(res, email);
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

module.exports = router;