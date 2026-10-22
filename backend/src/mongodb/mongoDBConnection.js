
const mongoose = require("mongoose");
const configData = require("../config/config");

const connectWithDB = async () => {
    try {
        await mongoose.connect(configData.MONGODB_URL);
        console.log("Database connected successfully to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
};

module.exports = connectWithDB;
