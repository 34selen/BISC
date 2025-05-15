import Request from "./request.module.js";

export default class Chat {
    constructor() {}

    async send(message) {
        const request = new Request();
        const chat_id = location.search.split("=")[1];
        const chat_password = location.search.split("=")[2];

        let url = "/chat/send?chat_id=" + chat_id;

        if (message) {
            if (chat_password) {
                url += "=" + chat_password;
            }

            request.setURL(url);
            request.setMethod("POST");
            request.setBody({ message: message });
            request.setHeader({ "Content-Type": "application/json" });
                
            return await request.send();
        }
    }

    async createChat(username) {
        const request = new Request();

        request.setURL("/chat/create");
        request.setMethod("POST");
        request.setBody({ username: username });
        request.setHeader({ "Content-Type": "application/json" });

        return await request.send();
    }
}