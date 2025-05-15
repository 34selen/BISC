import Request from "./request.module.js";

export default class AdminCheck {
    constructor() {}

    async send(key) {
        const request = new Request();
        
        let url = "/admin/check";

        if (key) {
            request.setURL(url);
            request.setMethod("POST");
            request.setBody({ key: key });
            request.setHeader({ "Content-Type": "application/json" });
                
            return await request.send();
        }
    }
}