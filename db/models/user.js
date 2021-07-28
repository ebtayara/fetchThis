'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    hashedPassword: DataTypes.STRING.BINARY,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.List, {foreignKey: 'userId'})
    User.hasMany(models.Task, {foreignKey: 'userId'})

  };
  return User;
};
