const jwt = require("jsonwebtoken");

require("dotenv").config();

class JWT {
    constructor(accessToken=null) {
        if (accessToken) this.accessToken = accessToken;
    }

    isNoneData() {
        if (this.accessToken == null) return true;
        else return false;
    }

    sign(payload) {
        try {
            const env = process.env;
    
            return jwt.sign(payload, env.JWT_SECRET, {
                algorithm: "HS256",
                expiresIn: env.JWT_EXPIRES,
                issuer: env.JWT_ISSUER,
            });
        } catch (err) {
            return null;
        }
    }

    verify() {
        try {
            const env = process.env;
            const decode_data = jwt.verify(this.accessToken, env.JWT_SECRET);
            return decode_data;
        } catch (err) {
            if (err.message === "jwt expired") {
                return "expired";
            } else if (err.message === "invalid token") { 
                return "invalid";
            } else {
                return "invalid";
            }
        }   
    }
}

module.exports = JWT;