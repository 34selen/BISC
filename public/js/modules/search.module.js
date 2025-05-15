import Request from "./request.module.js";

export default class Search {
    constructor() {}

    async send(text) {
        const request = new Request();
        const chat_id = location.search.split("=")[1];
        const chat_password = location.search.split("=")[2];

        let url = "/search?chat_id=" + chat_id;

        if (text) {
            if (chat_password) {
                url += "=" + chat_password;
            }

            request.setURL(url);
            request.setMethod("POST");
            request.setBody({ search_text: text });
            request.setHeader({ "Content-Type": "application/json" });
                
            return await request.send();
        }
    }
}