const models = require("../models");
const hash = require("../middlewares/hash.middleware.js");

class Signup {
    constructor(id, username, email, password, repassword) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.repassword = repassword;
    }

    isNoneData() {
        for (let key of ["id", "username", "email", "password", "repassword"]) {
            if (this[key] == null) return true;
        }

        return false;
    }

    isNotMatchPassword() {
        if (this.password != this.repassword) return true;
        else return false;
    }

    isNotMatchEmail() {
        let regex = new RegExp("[a-z0-9]+@[a-z]+\.[a-z]{2,3}");

        if (!regex.test(this.email)) return true;
        else return false;
    }

    isCurrectType() {
        let currectBoolArr = [];

        for (let key of ["id", "username", "email", "password", "repassword"]) {
            if (typeof this[key] == "string") currectBoolArr.push(true);
        }

        if (currectBoolArr.length == 5) return true;
        else return false;
    }

    async existUser() {
        try {
            const user = await models.user.findOne({
                where: { username: this.username }
            });

            if (user) return true;
            else return false;
        } catch {
            return false;
        }
    }

    async createUser() {
        const hashPassword = hash.generateHash(this.password);

        try {
            return await models.user.create({
                id: this.id,
                username: this.username,
                role: "general",
                email: this.email,
                password: hashPassword
            });
        } catch {
            return null;
        }
    }
}

module.exports = Signup;