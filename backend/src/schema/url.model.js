const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    longurl: {
        type: String,
        required: [true, "Long URL is required"],
        unique: true,
        trim: true
    },
    randomstring: {
        type: String,
        required: [true, "Short URL is required"],
        unique: true,
        trim: true
    },
    shortlink: {
        type: String,
        required: [true, "Short URL is required"],
        unique: true,
        trim: true
    }
});

const urlModel = mongoose.model("url-sortner", urlSchema);

module.exports = urlModel;
