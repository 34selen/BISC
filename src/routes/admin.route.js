const express = require("express");
const admin = require("../controllers/admin.controller.js");
const jwtAuth = require("../controllers/jwt.controller.js");

const router = express.Router();

router.get("/", jwtAuth, admin.renderFile);
router.get("/download", jwtAuth, admin.download);

router.post("/check", jwtAuth, admin.check);

module.exports = router;