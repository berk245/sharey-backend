const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");
const User = require('./User.model')
const Item = require('./Item.model')
const ItemUsage = require('./ItemUsage.model')

const ItemReview = db.define(
  "ItemReview",
  {
    review_id: {
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
    reviewed_item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references:{
        model: Item,
        key: 'item_id'
      }
    },
    item_usage_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        references:{
          model: ItemUsage,
          key: 'usage_id'
        }
      },
    review_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_rating_positive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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

module.exports = ItemReview;
