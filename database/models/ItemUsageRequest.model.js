const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");
const User = require("./User.model"); // Import User model
const Item = require("./Item.model"); // Import User model


const ItemUsageRequest = db.define(
  "ItemUsageRequest",
  {
    request_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references:{
        model: User,
        key: 'user_id'
      }
    },
    item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references:{
        model: Item,
        key: 'item_id'
      }
    },
    request_message: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    date_to_use: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    created_at: {
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

module.exports = ItemUsageRequest;
