const JWT  = require("./jwt.service.js");
const models = require("../models");

class Login {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    isNoneData() {
        for (let key of ["username", "password"]) {
            if (this[key] == null) return true;
        }

        return false;
    }

    isCurrectType() {
        if (typeof this.username == "string" && typeof this.password == "string") {
            return true;
        } else {
            return false;
        }
    }

    async getUser() {
        try {
            return await models.user.findOne({
                where: { username: this.username }
            });
        } catch {
            return null;
        }
    }

    async createAccessToken() {
        try {
            const jwt = new JWT();
            const user = await this.getUser();
    
            if (!user) return null;
    
            const payload = {
                id: user.dataValues.id,
                username: user.dataValues.username,
                email: user.dataValues.email,
            };
    
            const accessToken = jwt.sign(payload);
    
            return accessToken;
        } catch (err) {
            return null;
        }
    }
}

module.exports = Login;