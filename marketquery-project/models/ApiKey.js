'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ApiKey extends Model {
    static associate(models) {
      // Menghubungkan ApiKey kembali ke User
      ApiKey.belongsTo(models.User, { foreignKey: 'ID_User', as: 'user' });
    }
  }

  ApiKey.init({
    ID_ApiKey: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_User: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    Key: { // Harus 'Key' dengan huruf K besar sesuai script SQL kamu
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'ApiKey',
    tableName: 'ApiKey', // Nama tabel di MySQL
    timestamps: true     // Karena di SQL kamu ada createdAt/updatedAt
  });

  return ApiKey;
};