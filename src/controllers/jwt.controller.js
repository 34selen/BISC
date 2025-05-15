const JWT = require("../services/jwt.service.js");
const { UserDAO } = require("../services/dao.service.js");

const settingReqObj = (req, dbUser) => {
    try {
        const user = dbUser.dataValues;

        for (let key of ["id", "username", "email"]) {
            req[key] = user[key];
        }
        
        return true;
    } catch {
        return false;
    }
}


const check = async (req, res, next) => {
    if (req.cookies.accessToken) {
        const accessToken = req.cookies.accessToken;

        const jwt = new JWT(accessToken);

        if (jwt.isNoneData()) return res.redirect("/auth/login");

        const payload = jwt.verify();

        if (payload == "expired" || payload == "invalid" || payload == null) {
            return res.redirect("/auth/login");
        } else {
            const userDAO = new UserDAO();

            const user = await userDAO.getUser(payload.username);

            if (!user) return res.redirect("/auth/login");

            settingReqObj(req, user);

            next();
        };
    } else {
        return res.redirect("/auth/login");
    }
}

module.exports = check;