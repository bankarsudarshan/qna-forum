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
      'vote_count',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      }
    );
    await queryInterface.addColumn(
      'answers',
      'vote_count',
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
    queryInterface.removeColumn('questions', 'vote_count');
    queryInterface.removeColumn('answers', 'vote_count');
  }
};
