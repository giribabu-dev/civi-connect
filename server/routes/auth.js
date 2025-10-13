const { Router } = require("express");
const { emailRegex } = require("../utils/regex");
const { sendOtp, verifyOtp } = require("../services/authService");

const router = Router();

router.post("/otp/send", async (req, res) => {

    try {

        const { email } = req.body;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        await sendOtp(res, email);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post("/otp/verify", async (req, res) => {

    try {

        const { email, otp } = req.body;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid payload" });
        }

        await verifyOtp(res, email, otp);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;