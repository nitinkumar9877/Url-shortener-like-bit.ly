const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const urlRoutes = require("./routes/app.routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/url", urlRoutes);
module.exports = app;
