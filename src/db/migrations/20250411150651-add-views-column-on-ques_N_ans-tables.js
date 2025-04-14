'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      'questions',
      'views',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      }
    );
    await queryInterface.addColumn(
      'answers',
      'views',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      }
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('questions', 'views');
    queryInterface.removeColumn('answers', 'views');
  }
};
