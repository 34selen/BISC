const path = require("path");
const fs = require("fs");
const glob = require("glob");
const generator = require("../middlewares/generator.middleware.js");
const { ChatDAO } = require("./dao.service.js");

class History {
    constructor() {}

    async getHistory(opponent1, opponent2, chat_id) {
        const filename_gen = generator.filename(opponent1, opponent2, chat_id);
        const filepath = filename_gen.filepath;

        const isExistFile = await fs.existsSync(filepath);

        if (isExistFile) {
            const dataBuffer = await fs.readFileSync(filepath);
            const dataJSON = dataBuffer.toString();

            return dataJSON;
        } else {
            return null;
        }
    }

    async getHistoryList(user_id) {
        const chatDAO = new ChatDAO();
        const fileList = await chatDAO.getChats(user_id);

        let chat_datas = [];

        if (fileList) {
            for (let i = 0; i < fileList.length; i++) {
                const chat = fileList[i].dataValues;
                const chat_id = chat.id;
                const fileData = await this.getHistory(chat.opponent1, chat.opponent2, chat_id);
                const fileJSON = JSON.parse(fileData);

                chat_datas.push({
                    title: fileJSON[1].title,
                    opponent1: fileJSON[1].opponent1,
                    opponent2: fileJSON[1].opponent2
                });
            }

            return chat_datas;
        } else {
            return null;
        }
    }
}

module.exports = History;