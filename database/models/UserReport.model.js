const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");
const User = require("./User.model"); // Import User model

const UserReport = db.define(
  "UserReport",
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
    reported_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references:{
        model: User,
        key: 'user_id'
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

module.exports = UserReport;
