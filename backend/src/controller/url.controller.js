const generateRandomString = require('../utils/randomString.utils.js');
const urlModel = require('../schema/url.model.js');

// const URLSortner = async (req, res) => {
//     try {
//         console.log("try : 1")
//         const { longurl } = req.body;
//         console.log("try : 2")
//         console.log("Req body :", longurl) // the backend flow break here

//         if (!longurl) {
//             console.log("inside if long ULR check from body")

//             return res.status(400).json({
//                 message: "Long URL is required"
//             });
//         }
//         console.log("try : 3")

//         const existingURL = await urlModel.findOne({ longurl });
//         console.log("try : 4")

//         if (existingURL) {
//             console.log("inside if where check existing url inside database");
//             return res.status(200).json({
//                 message: "This URL already has a short URL",
//                 longurl: existingURL.longurl,
//                 randomstring: existingURL.randomstring,
//                 shortURL: `${req.protocol}://${req.get('host')}/${existingURL.randomstring}`
//             });
//         }
//         let randomString;
//         let isExistrandomstring;
//         console.log("try : 5")

//         do {
//             randomString = generateRandomString();
//             isExistrandomstring = await urlModel.findOne({
//                 randomstring: randomString
//             });
//         } while (isExistrandomstring);

//         const url = await urlModel.create({
//             longurl,
//             randomstring: randomString,
//             shortURL: `${req.protocol}://${req.get('host')}/${existingURL.randomstring}`
//         });
//         console.log("try : 6");
//         console.log("api run successfully debuggig stop here")

//         return res.status(201).json({
//             message: "Short URL created successfully",
//             longurl: url.longurl,
//             randomstring: url.randomstring,
//             shortlink: `${req.protocol}://${req.get('host')}/${url.randomstring}`
//         });

//     } catch (err) {
//         console.log("catch : 1")

//         console.error("URL shortening error:", err);
//         console.log("catch : 2")

//         return res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// };


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

        console.log("try : 3");

        const existingURL = await urlModel.findOne({ longurl });

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

        const shortlink =`${req.protocol}://${req.get("host")}/url/${randomString}`;

        console.log("try : 6");
        console.log("This is longurl : ",longurl)
        console.log("This is randomString : ",randomString)
        console.log("This is shortlink : ",shortlink)
        const url = await urlModel.create({
            longurl: longurl,
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
            errMsg:err.message,
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
