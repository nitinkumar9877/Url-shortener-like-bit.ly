const express = require("express");
const urlRoutes = express.Router();
const {URLSortner, getURL } = require("../controller/url.controller.js");

urlRoutes.post("/url-sortner", URLSortner);
urlRoutes.get("/:randomstring", getURL);

module.exports = urlRoutes;