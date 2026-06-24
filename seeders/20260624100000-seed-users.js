"use strict";

const fs = require("fs");
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = await fs.promises.readFile("./dummyData/users.json", "utf8");
    data = JSON.parse(data);
    const salt = bcrypt.genSaltSync(10);

    data = data.map((item) => {
      delete item.id;
      item.createdAt = new Date();
      item.updatedAt = new Date();
      item.password = bcrypt.hashSync(item.password, salt);
      return item;
    });

    await queryInterface.bulkInsert("Users", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
