'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [
      { name:'Picking up 💩',description:'taking care of business', userId:1, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Training',description:'taking care of business', userId:1, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Grooming',description:'taking care of business', userId:1, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Feeding',description:'taking care of business', userId:1, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Walking',description:'taking care of business', userId:1, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Picking up 💩',description:'taking care of business', userId:2, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Training',description:'taking care of business', userId:2, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Grooming',description:'taking care of business', userId:2, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Feeding',description:'taking care of business', userId:2, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Walking',description:'taking care of business', userId:2, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() }
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
