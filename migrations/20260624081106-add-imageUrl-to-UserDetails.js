'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('UserDetails', 'imageUrl', {type: Sequelize.STRING});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserDetails', 'imageUrl');
  }
};
