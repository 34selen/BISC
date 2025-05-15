const Admin = require("../services/admin.service.js");
const { UserDAO } = require("../services/dao.service.js");
const filter = require("../middlewares/filter.middleware.js");
const path = require("path");

module.exports.renderFile = async (req, res, next) => {
    const admin_key = req.query.admin_key;
    const username = req.username;

    const admin = new Admin();
    const userDAO = new UserDAO();

    const user = await userDAO.getUser(username);

    if (admin.isCheckAdmin(admin_key) && user) {
        const admin_user = admin.getAdmin(admin_key);

        if (admin_user.admin_id == user.dataValues.id) return res.sendFile(path.join(__dirname + "/../../public/views/admin.html"));
        else return res.sendFile(path.join(__dirname + "/../../public/views/admin_check.html")); 
    } else {
        return res.sendFile(path.join(__dirname + "/../../public/views/admin_check.html"));
    }
}

module.exports.check = async (req, res, next) => {
    const username = req.username;
    const admin_key = req.body.key;

    if (!admin_key || typeof admin_key != "string") return res.json({ isCheck: false }).status(400);

    const userDAO = new UserDAO();
    const admin = new Admin();

    const user = await userDAO.getUser(username);
    const default_admin_key = admin.getAdminKey();

    if (!user) return res.json({ isCheck: false }).status(400);

    if (default_admin_key == admin_key) {
        const user_id = user.dataValues.id;
        const verifyed_admin_key = admin.addAdmin(user_id, admin_key);
    
        return res.json({ isCheck: true, key: verifyed_admin_key }).status(200);
    } else {
        return res.json({ isCheck: false }).status(400);
    }
}

module.exports.download = async (req, res, next) => {
    const filename = filter.file(req.query.filename);
    const admin_key = req.query.admin_key;
    const username = req.username;

    if (!filename || !admin_key) return res.json({ isFile: false }).status(403);

    const admin = new Admin();
    const userDAO = new UserDAO();

    const user = await userDAO.getUser(username);

    if (!admin.isCheckAdmin(admin_key) || !user) return res.json({ isFile: false }).status(403); 

    const admin_user = admin.getAdmin(admin_key);
        
    if (admin_user.admin_id != user.dataValues.id) return res.json({ isFile: false }).status(403); 

    const default_dir_path = process.env.ADMIN_DOWNLOAD_DEFAULT_PATH;
    const filepath = default_dir_path + filename;

    const data = await admin.downloadFile(filepath);

    if (data) {
        res.setHeader('Content-Length', data.length);
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', 'attachment; filename=downloaded.txt');

        return res.send(data).status(200);
        
    } else return res.json({ isFile: false }).status(400);
}