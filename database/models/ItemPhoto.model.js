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
    item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references:{
        model: Item,
        key: 'item_id'
      }
    },
    photo_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ItemPhoto;
