import Request from "./request.module.js";

export default class Admin {
    constructor() {}

    async send(filename) {
        const request = new Request();
        const admin_key = location.search.split("=")[1];

        let url = `/admin/download?admin_key=${admin_key}&filename=${filename}`;

        request.setURL(url);
        request.setMethod("GET");
            
        return await request.send();
    }
}