const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");

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
    },
    item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    request_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_to: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
