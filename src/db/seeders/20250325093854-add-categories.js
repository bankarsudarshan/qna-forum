'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('categories', [
      { name: 'javascript', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'python', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'c++', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'c', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'node', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'java', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'sppu', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'computer engineering', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'information technology', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'electronics and communication engineering', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'database management system', createdAt: new Date(), updatedAt: new Date()  },
      { name: 'operating system', createdAt: new Date(), updatedAt: new Date() },  
      { name: 'theory of computation', createdAt: new Date(), updatedAt: new Date()  },
      { name: 'digital electronics', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'probability', createdAt: new Date(), updatedAt: new Date()  },
      { name: 'linear algebra', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'calculus', createdAt: new Date(), updatedAt: new Date()  },
      { name: 'maths', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'artificial intelligence', createdAt: new Date(), updatedAt: new Date()  },
      { name: 'data science', createdAt: new Date(), updatedAt: new Date() },
      { name: 'react', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'frontend', createdAt: new Date(), updatedAt: new Date()  },
      { name: 'html', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'css', createdAt: new Date(), updatedAt: new Date() }, 
      { name: 'backend', createdAt: new Date(), updatedAt: new Date() },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
  }
};
