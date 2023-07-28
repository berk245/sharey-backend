const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");
const User = require("./User.model"); // Import User model
const Category = require("./Category.model"); // Import Category model

const Item = db.define(
  "Item",
  {
    item_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Category,
        key: "category_id",
      },
    },
    item_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    item_description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "Item",
    timestamps: false,
  }
);

module.exports = Item;
