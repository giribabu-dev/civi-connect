const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);

// MongoDB connect
mongoose.connect("mongodb://localhost:27017/CiviConnect")
    .then(() => {
        console.log("Connected to database")
    })
    .catch(() => {
        console.log("Failed to connect database")
    })

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});