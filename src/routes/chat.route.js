const express = require("express");
const chat = require("../controllers/chat.controller.js");
const jwtAuth = require("../controllers/jwt.controller.js");

const router = express.Router();

router.post("/send", jwtAuth, chat.send);
router.post("/create", jwtAuth, chat.create);

module.exports = router;