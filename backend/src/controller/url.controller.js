const generateRandomString = require('../utils/randomString.utils.js');
const urlModel = require('../schema/url.model.js');

const URLSortner = async (req, res) => {
    try {
        console.log("try : 1");

        const { longurl } = req.body;

        console.log("try : 2");
        console.log("Req body:", longurl);

        if (!longurl) {
            return res.status(400).json({
                message: "Long URL is required"
            });
        }

        let parsedURL;
        try {
            parsedURL = new URL(longurl.trim())
        }
        catch {
            return res.status(400).json({
                message: "Invalid URL format"
            })
        }

        if (!["http:", "https:"].includes(parsedURL.protocol)) {
            return res.status(400).json({
                message: "Only HTTP and HTTPS URLs are allowed"
            });
        }

        if (parsedURL.username || parsedURL.password) {
            return res.status(400).json({
                message: "URLs containing usernames or passwords are not allowed"
            });
        }

        if (parsedURL.protocol !== "https:") {
            return res.status(400).json({
                message: "Please enter a secure HTTPS URL"
            });
        }

        const validatedURL = parsedURL.href;

        console.log("try : 3");

        const existingURL = await urlModel.findOne({ longurl: validatedURL });

        console.log("try : 4");

        if (existingURL) {
            return res.status(200).json({
                message: "This URL already has a short URL",
                longurl: existingURL.longurl,
                randomstring: existingURL.randomstring,
                shortlink: existingURL.shortlink
            });
        }

        let randomString;
        let isExistrandomstring;

        console.log("try : 5");

        do {
            randomString = generateRandomString();

            isExistrandomstring = await urlModel.findOne({
                randomstring: randomString
            });

        } while (isExistrandomstring);

        const shortlink = `${req.protocol}://${req.get("host")}/url/${randomString}`;

        console.log("try : 6");
        console.log("This is longurl : ", validatedURL)
        console.log("This is randomString : ", randomString)
        console.log("This is shortlink : ", shortlink)
        
        const url = await urlModel.create({
            longurl: validatedURL,
            randomstring: randomString,
            shortlink: shortlink
        });
        console.log("try : 7");
        console.log("API ran successfully");

        return res.status(201).json({
            message: "Short URL created successfully",
            longurl: url.longurl,
            randomstring: url.randomstring,
            shortlink: url.shortlink
        });
    } catch (err) {
        console.error("URL shortening error:", err);

        return res.status(500).json({
            message: "Internal server error",
            error: err,
            errMsg: err.message,
            name: err.name
        });
    }
};


const getURL = async (req, res) => {
    try {
        const randomstring = req.params.randomstring;

        console.log("Received code:", JSON.stringify(randomstring));
        console.log("Database:", urlModel.db.name);
        console.log("Collection:", urlModel.collection.name);

        // Check the exact matching document
        const exactMatch = await urlModel.findOne({
            randomstring: randomstring
        }).lean();

        console.log("Exact match:", exactMatch);

        // Check all documents
        const allURLs = await urlModel.find({}).lean();

        console.log("All documents:", JSON.stringify(allURLs, null, 2));

        if (!exactMatch) {
            res.status(404).json({
                message: "Short URL not found"
            });
            return
        }

        res.redirect(302, exactMatch.longurl);
        return

    } catch (err) {
        console.error("Redirect error:", err);

        res.status(500).json({
            message: "Internal server error"
        });
        return
    }
};


module.exports = { URLSortner, getURL };
