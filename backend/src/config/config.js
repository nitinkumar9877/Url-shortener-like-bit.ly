const dotenv = require("dotenv");
dotenv.config();

if (!process.env.MONGODBURL) {
    throw new Error("MongoDb is not defined in the environment variable")
}
if (!process.env.PORT) {
    throw new Error("Port is never defined in the environment varibale");
}

const configData = {
    MONGODB_URL: process.env.MONGODBURL,
    PORT: process.env.PORT
}

module.exports = configData;