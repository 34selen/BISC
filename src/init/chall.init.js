const models = require("../models");
const fs = require("fs");

const user_list = [
    {
        id: "[*SECRET*]", 
        username: "jun0911.dev", 
        role: "general", 
        email: "jun0911@company.com", 
        password: "[*SECRET*]"
    },
    {
        id: "[*SECRET*]", 
        username: "dream", 
        role: "general", 
        email: "dream@company.com", 
        password:"[*SECRET*]"
    },
    {
        id: "[*SECRET*]", 
        username: "qwer", 
        role: "general", 
        email: "qwer@company.com", 
        password: "[*SECRET*]"
    },
    {
        id: "[*SECRET*]", 
        username: "ahfmrpTek", 
        role: "security", 
        email: "ahfmrptek@company.com", 
        password: "[*SECRET*]"
    },
    {
        id: "[*SECRET*]", 
        username: "secdev", 
        role: "developer", 
        email: "secdev@company.com", 
        password: "[*SECRET*]"},
    {
        id: "[*SECRET*]", 
        username: "cto", 
        role: "manager", 
        email: "cto@company.com", 
        password: "[*SECRET*]"
    }
];

const chat_list = [
    {
        id: "[*SECRET*]", 
        opponent1: "[*SECRET*]", // cto
        opponent2: "[*SECRET*]", // dream
        is_secret: 1, 
        password: "[*SECRET*]"
    },
    {
        id: "[*SECRET*]", 
        opponent1: "[*SECRET*]", 
        opponent2: "[*SECRET*]", 
        is_secret: 0,
    },
];

const challange_init = async () => {
    for (let i = 0; i < 6; i++) {
        const user = user_list[i];

        await models.user.create({
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            password: user.password,
        });
    }

    for (let j = 0; j < 2; j++) {
        const chat = chat_list[j];

        if (j == 0) {
            await models.chat.create({
                id: chat.id,
                opponent1: chat.opponent1,
                opponent2: chat.opponent2,
                is_secret: chat.is_secret,
                password: chat.password,
            });
        } else {
            await models.chat.create({
                id: chat.id,
                opponent1: chat.opponent1,
                opponent2: chat.opponent2,
                is_secret: chat.is_secret,
            });
        }
    }
    
    await fs.writeFileSync("/company/resource/data/[*SECRET*]/test_resource.txt", "HEELO! THIS IS TEST DATA");
    await fs.writeFileSync("/company/resource/data/[*SECRET*]/bisc_company.txt", "BISC Compony is very very good company");

    const secret = await fs.readFileSync("/app/secret_project_note.txt", { encoding: "utf8", flag: "r" });

    console.log("Init Ok, secret read : ", secret);
}

module.exports = challange_init;