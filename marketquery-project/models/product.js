'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {}
  }

  Product.init({
    ID_Product: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nama_barang: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    harga: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    kategori: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gambar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
  });

  return Product;
};
