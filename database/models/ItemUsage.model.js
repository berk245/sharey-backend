const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");

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
    },
    item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    item_usage_request_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    status:{
        type: DataTypes.ENUM('cancelled', 'scheduled', 'active', 'completed', 'conflict'),
        allowNull: false,
        defaultValue: 'scheduled'
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
