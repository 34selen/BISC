const { UserDAO } = require("../services/dao.service.js");
const path = require("path");

module.exports.renderFile = async (req, res, next) => {
    res.sendFile(path.join(__dirname + "/../../public/views/users.html"));
}

module.exports.loadUsers = async (req, res, next) => {
    const userDAO = new UserDAO();
    const userList = await userDAO.getUsers();

    let users = [];

    if (!userList) return res.json({ isUserList: false }).status(400);

    for (let i = 0; i < userList.length; i++) {
        const user = userList[i].dataValues;

        users.push({
            id: i,
            user_id: user.username,
            email: user.email,
            role: user.role,
        });
    }

    res.json({
        isUserList: true,
        list: users
    }).status(200);
}

module.exports.searchUser = async (req, res, next) => {
    const search_value = req.body.search_text;
    const search_key = req.body.search_key;

    if (!search_value || !search_key) return res.json({ isSearched: false }).status(400);
    
    const userDAO = new UserDAO();
    const userList = await userDAO.search(search_value, search_key);

    let users = [];

    if (!userList) return res.json({ isSearched: false }).status(400);

    for (let i = 0; i < userList.length; i++) {
        const user = userList[i].dataValues;

        users.push({
            id: i,
            user_id: user.username,
            email: user.email,
            role: user.role,
        });
    }

    res.json({
        isSearched: true,
        list: users
    }).status(200);
}