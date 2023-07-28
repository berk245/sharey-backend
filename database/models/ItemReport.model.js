const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");
const User = require("./User.model"); // Import User model
const Item = require("./Item.model"); // Import User model
const ItemReport = db.define(
  "ItemReport",
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
        key: 'user_id',
      }
    },
    reported_item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references:{
        model: Item,
        key: 'item_id',
      }
    },
    report_text: {
      type: DataTypes.TEXT,
      allowNull: true,
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
  }
);

module.exports = ItemReport;
