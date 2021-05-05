'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    listId: DataTypes.INTEGER,
    completed: DataTypes.BOOLEAN
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
    Task.belongsTo(models.User, {foreignKey: 'userId'})
    Task.belongsTo(models.List, {foreignKey: 'listId'})

  };
  return Task;
};
