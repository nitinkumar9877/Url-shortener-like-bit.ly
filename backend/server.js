const configData = require("./src/config/config.js")
const app = require("./src/app.js")
const connectWithDB = require("./src/mongodb/mongoDBConnection.js")

connectWithDB();

app.listen(configData.PORT, () => {
    console.log("Server is running on Port :", configData.PORT)
})
