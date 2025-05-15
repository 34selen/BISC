const path = require("path");

module.exports = (req, res, neex) => {
    res.sendFile(path.join(__dirname + "/../../public/views/index.html"));
}