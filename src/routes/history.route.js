const express = require("express");
const history = require("../controllers/history.controller.js");
const jwtAuth = require("../controllers/jwt.controller.js");

const router = express.Router();

router.get("/list", jwtAuth, history.list);
router.get("/data", jwtAuth, history.data);

module.exports = router;