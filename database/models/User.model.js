const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");
const City = require("./City.model");

const User = db.define(
  "User",
  {
    user_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    city_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: City,
        key: 'city_id'
      }
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    member_since: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    profile_photo_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  },
  {
    tableName: "User",
    timestamps: false,
  }
);

module.exports = User;


