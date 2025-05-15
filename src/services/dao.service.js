const models = require("../models");
const filter = require("../middlewares/filter.middleware.js");
const { Op, Sequelize }  = require("sequelize");

class UserDAO {
    constructor() {}

    async getUser(username) {
        try {
            return await models.user.findOne({
                where: { username: username }
            });
        } catch {
            return null;
        }
    }

    async getUsers() {
        try {
            return await models.user.findAll();
        } catch {
            return null;
        }
    }

    async getUserById(id) {
        try {
            return await models.user.findOne({
                where: { id: id }
            });
        } catch {
            return null;
        }
    }

    async search(value, check_key) {
        try {
            return await models.user.findAll({
                where: { 
                    [Op.and]: [
                        Sequelize.literal('md5("[*SECRET*]") = :check_key'),
                        { username: { [Op.like]: `%${filter.sqli(value)}%` } }
                    ]
                },
                replacements: { check_key }
            });
        } catch (err) {
            return null;
        }
    }
}

class ChatDAO {
    constructor() {}

    async getChatById(chat_id) {
        try {
            return await models.chat.findOne({
                where: { id: chat_id }
            });
        } catch {
            return null;
        }
    }

    async getChats(user_id) {
        try {
            return await models.chat.findAll({
                where: {
                    [Op.or]: [
                        { opponent1: user_id },
                        { opponent2: user_id }
                    ]
                }
            });
        } catch {
            return null;
        }
    }
}


module.exports.UserDAO = UserDAO;
module.exports.ChatDAO = ChatDAO;