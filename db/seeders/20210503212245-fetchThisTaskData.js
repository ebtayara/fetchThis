'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [
      { name:'Picking up 💩',description:'taking care of business', userId:1, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Training',description:'made appt to train doggo', userId:1, listId:1, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Grooming',description:'it\'s about that time!,', userId:1, listId:5, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Feeding',description:'buy more food', userId:1, listId:6, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Walking',description:'take them out to the park', userId:1, listId:5, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Litter Box 💩',description:'clean out litter box!', userId:2, listId:2, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Get Clothes',description:'buy new kitty clothes', userId:2, listId:3, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'treats',description:'buy hamster treats', userId:2, listId:4, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Vet',description:'Time for annual visit!', userId:2, listId:2, completed:false, createdAt:new Date(), updatedAt:new Date() },
      { name:'Pharmacy',description:'pick up prescription', userId:2, listId:3, completed:false, createdAt:new Date(), updatedAt:new Date() }
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
