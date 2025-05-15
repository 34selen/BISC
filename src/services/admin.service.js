const fs = require("fs");
const uuidv4 = require("uuid4");
const execFile = require("util").promisify(require("child_process").execFile);

const admin_verify_table = [];

class Admin {
    constructor() {}

    getAdminKey() {
        return "[*SECRET*]"
    }

    getAdmin(admin_key) {
        try {
            const admin_data = admin_verify_table[admin_key];

            if (admin_data) return admin_data;
            else return null;
        } catch {
            return null;
        }
    }

    addAdmin(user_id, admin_key) {
        const new_admin_key = uuidv4();

        admin_verify_table[new_admin_key] = {
            admin_id: user_id,
            key: admin_key,
        };

        return new_admin_key;
    }  

    isCheckAdmin(admin_key) {
        try {
            const admin_data = admin_verify_table[admin_key];

            if (admin_data) return true;
            else return false;
        } catch {
            return false;
        }
    }

    async downloadFile(filepath) {
        try {
            const proc = await execFile("curl", [`file://${filepath}`], { timeout: 1000 });
            const filedata = proc.stdout;
            
            if (filedata) return filedata;
            else return null;
        } catch {
            return null;
        }
    }
}

module.exports = Admin;