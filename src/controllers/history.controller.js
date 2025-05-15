const History = require("../services/history.service.js");
const hash = require("../middlewares/hash.middleware.js");
const { UserDAO, ChatDAO } = require("../services/dao.service.js");

module.exports.list = async (req, res, next) => {
    const username = req.username;

    const userDAO = new UserDAO();
    const chatDAO = new ChatDAO();

    const user = await userDAO.getUser(username);

    if (!user) res.json({ isHistory: false }).status(400);

    const datas = await chatDAO.getChats(user.dataValues.id);
    const list = [];

    for (let i = 0; i < datas.length; i++) {
        const data = datas[i].dataValues;

        const opponent1 = await userDAO.getUserById(data.opponent1);
        const opponent2 = await userDAO.getUserById(data.opponent2);
    
        const title = user.dataValues.id == data.opponent1 ? `${opponent2.dataValues.username} 직원 채팅` : `${opponent1.dataValues.username} 직원 채팅`;

        list.push({
            title: title,
            id: data.id,
            opponent1: data.opponent1,
            opponent2: data.opponent2,
            isSecret: data.is_secret ? true : false
        });
    }

    return res.json({
        isHistory: true,
        list: list,
    }).status(200);
}

module.exports.data = async (req, res, next) => {
    const chat_id = req.query.chat_id;
    const chat_password = req.query.chat_password;
    const username = req.username;

    const userDAO = new UserDAO();
    const chatDAO = new ChatDAO();
    const history = new History();

    if (!chat_id) return res.json({ isHistoryJSON: false }).status(400);

    const user = await userDAO.getUser(username);
    const chat = await chatDAO.getChatById(chat_id);

    if (!user || !chat) return res.json({ isHistoryJSON: false }).status(400);

    if (chat.dataValues.is_secret) {
        if (!chat_password) return res.json({ isSended: false, isSecret: true }).status(403);

        const hashedPassword = hash.generateHash(chat_password);

        if (chat.dataValues.password != hashedPassword) return res.json({ isHistoryJSON: false, isSecret: true }).status(403);
    }

    const user_id = user.dataValues.id;
    const opponent1 = chat.dataValues.opponent1;
    const opponent2 = chat.dataValues.opponent2;

    if (opponent1 != user_id && opponent2 != user_id) return res.json({ isHistoryJSON: false }).status(400);

    const historyJSON = await history.getHistory(opponent1, opponent2, chat_id);

    if (historyJSON) {
        return res.json({ 
            isHistoryJSON: true,
            json: JSON.parse(historyJSON),
            username: username,
        }).status(200);
    } else {
        return res.json({ isHistoryJSON: false }).status(403);
    }
}