import Request from "./request.module.js";

export default class User {
    constructor() {}

    async get() {
        const request = new Request();

        let url = "/user/get";

        request.setURL(url);
        request.setMethod("GET");
            
        return await request.send();
    }

    async search(text) {
        const request = new Request();
        const key = location.search.split("=")[1];

        let url = "/user/search";

        request.setURL(url);
        request.setMethod("POST");
        request.setBody({ search_text: text, search_key: key });
        request.setHeader({ "Content-Type": "application/json" });
            
        return await request.send();
    }
}