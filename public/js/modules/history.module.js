import Request from "./request.module.js";

export default class Hisotry {
    constructor() {}

    async getHistoryList() {
        const request = new Request();

        request.setURL("/history/list");
        request.setMethod("GET");

        return await request.send();
    }

    async getHistory() {
        const request = new Request();
        const chat_id = location.search.split("=")[1];
        const chat_password = location.search.split("=")[2];

        let url = "/history/data?chat_id=" + chat_id;

        if (chat_password) {
            url += "=" + chat_password;
        }

        request.setURL(url);
        request.setMethod("GET");

        return await request.send();
    }
}