"use strict";

const fs = require("fs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = await fs.promises.readFile(
      "./dummyData/userDetails.json",
      "utf8",
    );
    data = JSON.parse(data);
    data = data.map((item) => {
      delete item.id;
      item.createdAt = new Date();
      item.updatedAt = new Date();
      return item;
    });

    await queryInterface.bulkInsert("UserDetails", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserDetails", null, {});
  },
};
