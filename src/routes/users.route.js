const express = require("express");
const users = require("../controllers/users.controller.js");
const jwtAuth = require("../controllers/jwt.controller.js");

const router = express.Router();

router.get("/", jwtAuth, users.renderFile);
router.get("/get", jwtAuth, users.loadUsers);

router.post("/search", jwtAuth, users.searchUser);

module.exports = router;