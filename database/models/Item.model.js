const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");
const User = require("./User.model"); // Import User model
const Category = require("./Category.model"); // Import Category model

const Item = db.define(
  "Item",
  {
    item_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// Define associations
Item.belongsTo(User, { foreignKey: "owner_id" }); // Item belongs to a User (owner)
Item.belongsTo(Category, { foreignKey: "category_id" }); // Item belongs to a Category

module.exports = Item;
