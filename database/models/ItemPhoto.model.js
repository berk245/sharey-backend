const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");
const Item = require("./Item.model"); // Import User model

const ItemPhoto = db.define(
  "ItemPhoto",
  {
    photo_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// Define associations
Item.belongsTo(Item, { foreignKey: "item_id" }); // Item belongs to a User (owner)

module.exports = ItemPhoto;
