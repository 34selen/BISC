const fs = require("fs");
const History = require("../services/history.service.js");
const Chat = require("../services/chat.service.js");
const generator = require("../middlewares/generator.middleware.js");
const { UserDAO, ChatDAO } = require("../services/dao.service.js");

module.exports.send = async (req, res, next) => {
    const chat_id = req.query.chat_id;
    const chat_password = req.query.chat_password;
    const chat_message = req.body.message;
    const username = req.username;

    const history = new History();
    const chat = new Chat();
    const userDAO = new UserDAO();
    const chatDAO = new ChatDAO();

    if (!chat_id) return res.json({ isSended: false }).status(400);

    const user = await userDAO.getUser(username);
    const chat_data = await chatDAO.getChatById(chat_id);

    if (!user || !chat_data) return res.json({ isSended: false }).status(400);

    if (chat_data.dataValues.is_secret) {
        if (!chat_password) return res.json({ isSended: false, isSecret: true }).status(403);

        const hashedPassword = hash.generateHash(chat_password);

        if (chat_data.dataValues.password != hashedPassword) return res.json({ isSended: false, isSecret: true }).status(403);
    }

    const user_id = user.dataValues.id;
    const opponent1 = chat_data.dataValues.opponent1;
    const opponent2 = chat_data.dataValues.opponent2;

    if (opponent1 != user_id && opponent2 != user_id) return res.json({ isSended: false }).status(400);

    const chatData = await history.getHistory(opponent1, opponent2, chat_id);

    if (!chatData) return res.json({ isSended: false }).status(400);

    const file_gen = generator.filename(opponent1, opponent2, chat_id);
    const filepath = file_gen.filepath;
    const toMessageObj = chat.createChatObj(chat_message, username);

    const isUpdated = chat.updateChat(filepath, chatData, toMessageObj);

    if (isUpdated) return res.json({ isSended: true }).status(200);
    else return res.json({ isSended: false }).status(400);
}

module.exports.create = async (req, res, next) => {
    const username = req.username;
    const opponent_username = req.body.username;

    const userDAO = new UserDAO();
    const chat = new Chat();

    const opponent1 = await userDAO.getUser(username);
    const opponent2 = await userDAO.getUser(opponent_username);

    if (!opponent1 || !opponent2) return res.json({ isCreated: false }).status(400);

    const opponent1_id = opponent1.dataValues.id;
    const opponent2_id = opponent2.dataValues.id;

    const createChat = await chat.createChat(opponent1_id, opponent2_id);

    if (!createChat) return res.json({ isCreated: false }).status(400);

    const filepath = generator.filename(opponent1_id, opponent2_id, createChat.dataValues.id).filepath;

    const updateChat = await chat.updateChat(filepath, "[]", {
        title: `${opponent1.dataValues.username} 직원 채팅`,
        opponent1: opponent1_id,
        opponent2: opponent2_id
    });

    if (!updateChat) return res.json({ isCreated: false }).status(400); 

    res.json({
        isCreated: true,
        opponent: opponent1.dataValues.username,
        chat_id: createChat.dataValues.id
    }).status(200);
}