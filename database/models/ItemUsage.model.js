const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");
const User = require("./User.model"); // Import User model
const Item = require("./Item.model"); // Import User model
const ItemUsageRequest = require("./ItemUsageRequest.model");

const ItemUsage = db.define(
  "ItemUsage",
  {
    usage_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Item,
        key: "item_id",
      },
    },
    item_usage_request_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: ItemUsageRequest,
        key: "request_id",
      },
      field: "item_usage_request_id", // Explicitly set the column name
    },
    status: {
      type: DataTypes.ENUM(
        "scheduled",
        "active",
        "cancelled",
        "completed",
        "conflict"
      ),
      allowNull: false,
      defaultValue: "scheduled",
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

module.exports = ItemUsage;
