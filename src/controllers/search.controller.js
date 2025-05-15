const { UserDAO, ChatDAO } = require("../services/dao.service.js");
const Search = require("../services/search.service.js");
const Hisotry = require("../services/history.service.js");
const hash = require("../middlewares/hash.middleware.js");

const secretCheck = (chat, chat_password) => {
    if (chat.dataValues.is_secret) {
        if (!chat_password) return "Secret Vaild Fail";

        const hashedPassword = hash.generateHash(chat_password);

        if (chat.dataValues.password != hashedPassword) return "Secret Vaild Fail";

        return "Secret Vaild Ok";
    } else {
        return "Not Secret";
    }
}

module.exports = async (req, res, next) => {
    const chat_id = req.query.chat_id;
    const chat_password = req.query.chat_password;
    const search_query = req.body.search_text;
    const username = req.username;

    const userDAO = new UserDAO();
    const chatDAO = new ChatDAO();
    const history = new Hisotry();
    const search = new Search();

    if (!chat_id || !search_query) return res.json({ isSearched: false }).status(400);

    const user = await userDAO.getUser(username);
    const chat = await chatDAO.getChatById(chat_id);

    if (!user || !chat) return res.json({ isSearched: false }).status(400);

    const user_id = user.dataValues.id;
    const opponent1 = chat.dataValues.opponent1;
    const opponent2 = chat.dataValues.opponent2;

    if (opponent1 != user_id && opponent2 != user_id) return res.json({ isSearched: false }).status(400);

    const isUseCommand = search.isUseCommand(search_query);
    const historyJSON = await history.getHistory(opponent1, opponent2, chat_id);

    if (isUseCommand) return res.json({ isSearched: false }).status(400);

    const parseCommand = search.parseCommand(search_query);
    const isCheckedText = search.check_text(historyJSON, search_query, parseCommand == "ALL_CHECK_TEXT" ? true : false);

    if (!isCheckedText) {
        const secret_check = secretCheck(chat, chat_password);

        if (secret_check == "Not Secret" || secret_check == "Secret Vaild Ok") return res.json({ isSearched: false, message: "Not Found" }).status(200);
        else return res.json({ isSearched: false, message: "No Result!" }).status(403);
    } else {
        const findedList = await search.search_text(historyJSON, search_query, search_query);
        const secret_check = secretCheck(chat, chat_password);

        if (findedList) {
            if (secret_check == "Not Secret" || secret_check == "Secret Vaild Ok") return res.json({ isSearched: true, findedList: findedList }).status(200); 
            else {
                return res.json({ isSearched: false, message: "No Result!" }).status(403)
            };
        }
    }
}