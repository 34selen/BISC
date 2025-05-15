const { sequelize } = require("../models");
const challange_init = require("../init/chall.init.js");
const { version } = require('sequelize/package.json');

sequelize.sync({ force: true })
.then(() => {
  /* docker only */
  challange_init();

  console.log("sequelize DB Connect Success, Version : " + version);
})
.catch((error) => {
  console.log("sequelize DB Error : ", error);
});