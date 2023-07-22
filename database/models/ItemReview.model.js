const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");
const Item = require("./Item.model"); // Import Item model
const User = require("./User.model"); // Import User model

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
    },
    reviewed_item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    item_usage_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    review_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
