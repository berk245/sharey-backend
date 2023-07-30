const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");

const Category = db.define(
  "Category",
  {
    category_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Category;