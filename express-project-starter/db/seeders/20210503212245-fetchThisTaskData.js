'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [
      { name:'picking up 💩',description:'taking care of business', userId:1, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'picking up 💩',description:'taking care of business', userId:2, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() }
      ,], {});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tasks', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:

    */
  }
};
