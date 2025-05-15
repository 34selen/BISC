const path = require("path");
const Signup = require("../services/signup.service.js");
const Login = require("../services/login.service.js");
const JWT  = require("../services/jwt.service.js");
const hash = require("../middlewares/hash.middleware.js");
const { UserDAO } = require("../services/dao.service.js");
const uuidv4 = require("uuid4");

module.exports.renderFile = (req, res, next) => {
    res.sendFile(path.join(__dirname + "/../../public/views/login.html"));
}

module.exports.renderSignFile = (req, res, next) => {
    res.sendFile(path.join(__dirname + "/../../public/views/signup.html"));
}

module.exports.logout = (req, res, next) => {
    res.clearCookie("accessToken");
    res.redirect("/auth/login");
}

module.exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    const login = new Login(username, password);

    if (login.isNoneData()) return res.send({ status: 401 }).status(401);
    else if (!login.isCurrectType()) return res.send({ status: 401 }).status(401);

    const user = await login.getUser();

    if (!user) return res.json({ status: 401 }).status(401);

    const hashPassword = hash.generateHash(password);

    if (user.dataValues.username == username && user.dataValues.password == hashPassword) {
        const accessToken = await login.createAccessToken();

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 3,
            httpOnly: true,
        });
    
        return res.json({ status: 200 }).status(200);
    } else {
        return res.json({ status: 401 }).status(401);
    }
}

module.exports.signup = async (req, res, next) => {
    const { username, email, password, repassword} = req.body;
    const id = uuidv4();
    const signup = new Signup(id, username, email, password, repassword);

    if (signup.isNoneData() || signup.isNotMatchPassword() || signup.isNotMatchEmail()) return res.json({ status: 401 }).status(400);
    else if (!signup.isCurrectType()) return res.json({ status: 400 }).status(400);

    const isExistUser = await signup.existUser();

    if (isExistUser) return res.json({ status: 401 }).status(400);

    const isCreated = await signup.createUser();
    
    if (isCreated) {
        res.json({ status: 200 }).status(200);
    } else {
        return res.json({ status: 401 }).status(400); 
    }
};

module.exports.check = async (req, res, next) => {
    if (req.cookies.accessToken) {
        const accessToken = req.cookies.accessToken;

        const jwt = new JWT(accessToken);

        if (jwt.isNoneData()) return res.json({ isLogin: false }).status(401);

        const payload = jwt.verify();

        if (payload == "expired" || payload == "invalid" || payload == null) {
            return res.json({ isLogin: false }).status(401);
        } else {
            const userDAO = new UserDAO();

            const user = await userDAO.getUser(payload.username);

            if (!user) return res.json({ isLogin: false }).status(401);

            return res.json({ isLogin: true, user: user.dataValues }).status(200);
        };
    } else {
        return res.json({ isLogin: false }).status(401);
    }
}