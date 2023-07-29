const { DataTypes } = require("sequelize");
const db = require("../config");
const Country = require("./Country.model");

const City = db.define(
  "City",
  {
    city_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Country,
        key: "country_id",
      },
    },
    city_name: {
      type: DataTypes.STRING(100),
    },
  },
  {
    tableName: "City",
    timestamps: false,
    indexes: [{
        unique: true,
        fields: ["city_name", "country_id"],
      },]
  }
);

module.exports = City;
