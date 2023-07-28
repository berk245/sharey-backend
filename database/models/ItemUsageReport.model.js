const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");
const User = require('./User.model')
const Item = require('./Item.model')
const ItemUsage = require('./ItemUsage.model')

const ItemUsageReport = db.define(
  "ItemUsageReport",
  {
    report_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    creator_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references:{
        model: User,
        key: 'user_id'
      }
    },
    reported_usage_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references:{
        model: ItemUsage,
        key: 'usage_id'
      }
    },
    report_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_resolved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    indexes: [{
      unique: true,
      fields: ["creator_id", "reported_usage_id"],
    },]
  }
);

module.exports = ItemUsageReport;
