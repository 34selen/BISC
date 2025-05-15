const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: __dirname + "/config/.env" });
require("./config/sequelize.connect.js");

const app = express();
const port = process.env.PORT;

const adminRouter = require("./routes/admin.route.js");
const searchRouter = require("./routes/search.route.js");
const usersRouter = require("./routes/users.route.js");
const chatRouter = require("./routes/chat.route.js");
const historyRouter = require("./routes/history.route.js");
const authRouter = require("./routes/auth.route.js");
const indexRouter = require("./routes/index.route.js");

app.use(cors());
app.use(express.json());

app.use("/static/image", express.static(path.join(__dirname + "/../public/image" )));
app.use("/static/css", express.static(path.join(__dirname + "/../public/css" )));
app.use("/static/js", express.static(path.join(__dirname + "/../public/js" )));

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/admin", adminRouter);
app.use("/search", searchRouter);
app.use("/history", historyRouter);
app.use("/chat", chatRouter);
app.use("/auth", authRouter);
app.use("/user", usersRouter);
app.use("/", indexRouter);

app.use((req, res, next) => {
    res.status(404);
});

app.listen(port, (err) => {
    if (err) return console.log(err);

    console.log(`server running success http://localhost:${String(port)}`);
})