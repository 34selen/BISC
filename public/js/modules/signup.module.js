import Request from "./request.module.js";

export default class Signup {
    constructor (id, email, pw, repw) {
        this.id = id;
        this.email = email;
        this.pw = pw;
        this.repw = repw;
    }

    async send() {
        const request = new Request();

        if (this.id && this.email && this.pw && this.repw) {
            request.setURL("/auth/signup");
            request.setMethod("POST");
            request.setBody({ username: this.id, email: this.email, password: this.pw, repassword: this.repw });
            request.setHeader({ "Content-Type": "application/json" });
                
            return await request.send();
        }
    }
}