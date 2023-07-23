const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");

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
    },
    reviewed_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    is_rating_positive: {
        type: DataTypes.BOOLEAN,
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = UserReview;
