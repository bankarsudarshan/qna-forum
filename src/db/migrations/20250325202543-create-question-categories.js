'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question_categories', {
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id'
        }
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        }
      }
    });

    // Adding a composite primary key on (question_id, category_id)
    await queryInterface.sequelize.query(`
      ALTER TABLE "question_categories" 
      ADD CONSTRAINT "question_categories_pkey" 
      PRIMARY KEY ("question_id", "category_id")
    `);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('question_categories');
  }
};