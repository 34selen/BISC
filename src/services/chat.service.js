const fs = require("fs");
const uuidv4 = require("uuid4");
const models = require("../models");

class Chat {
    constructor() {}

    async createChat(opponent1, opponent2, isSecret=false) {
        try {
            return await models.chat.create({
                id: uuidv4(),
                opponent1: opponent1,
                opponent2: opponent2,
                is_secret: isSecret ? 1 : 0
            });
        } catch {
            return null;
        }
    }

    async updateChat(filepath, chatData, chatObj) {
        try {
            const chat_data = JSON.parse(chatData);

            chat_data.push(chatObj);

            const stringifyJSON = JSON.stringify(chat_data);

            await fs.writeFileSync(filepath, stringifyJSON);

            return true;
        } catch {
            return false;
        }
    }

    createChatObj(message, username) {
        const messageJSON = {
            message: message,
            sender: username
        }

        return messageJSON;
    }
}

module.exports = Chat;