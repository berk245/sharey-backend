const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");
const User = require("./User.model");
const Item = require("./Item.model");

const UserReview = db.define(
  "UserReview",
  {
    review_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    creator_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      name: "FK_UserReview_CreatorUser",
    },
    reviewed_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      name: "FK_UserReview_ReviewedUser",
    },
    is_rating_positive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    review_text: {
      type: DataTypes.TEXT,
      allowNull: true,
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
      fields: ["creator_id", "reviewed_user_id"],
    },]
  }
);

module.exports = UserReview;
