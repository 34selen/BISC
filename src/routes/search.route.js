const express = require("express");
const search = require("../controllers/search.controller.js");
const jwtAuth = require("../controllers/jwt.controller.js");

const router = express.Router();

router.post("/", jwtAuth, search);

module.exports = router;