const express = require("express");
const renderFile = require("../controllers/index.controller.js");
const jwtAuth = require("../controllers/jwt.controller.js");

const router = express.Router();

router.get("/", jwtAuth, renderFile);

module.exports = router;