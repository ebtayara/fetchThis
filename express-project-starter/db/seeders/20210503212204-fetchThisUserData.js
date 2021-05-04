'use strict';

// {username:string,hashedPassword:string,email:string}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      { username:'Tyrion',hashedPassword:'password', email:'Tyrion@dobermans.com',createdAt:new Date(), updatedAt:new Date() },
      { username:'Ceviche',hashedPassword:'password', email:'Ceviche@cats.com',createdAt: new Date(), updatedAt:new Date()}

    ], {});
/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:

    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:

    */
  }
};
