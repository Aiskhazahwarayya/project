'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.ApiKey, { foreignKey: 'ID_User', as: 'apiKeys' });
      User.hasMany(models.ApiLog, { foreignKey: 'ID_User', as: 'apiLogs' });
    }
  }

  User.init({
    ID_User: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
      validate: { isIn: [['admin','user']] }
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });

  return User;
};
