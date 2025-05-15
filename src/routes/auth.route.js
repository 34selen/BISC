const express = require("express");
const auth = require("../controllers/auth.controller.js");
const jwtAuth = require("../controllers/jwt.controller.js");

const router = express.Router();

router.get("/login", auth.renderFile);
router.get("/signup", auth.renderSignFile);

router.get("/logout", jwtAuth, auth.logout);

router.post("/login", auth.login);
router.post("/signup", auth.signup);
router.post("/check", auth.check);

module.exports = router;