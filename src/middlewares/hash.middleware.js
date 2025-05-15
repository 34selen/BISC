const crypto = require("crypto");

const generateHash = (data) => {
    const hash = crypto.createHash("sha256");
    
    hash.update(data);

    return hash.digest("hex");
}

module.exports.generateHash = generateHash;