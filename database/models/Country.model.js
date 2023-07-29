const { DataTypes } = require("sequelize");
const db = require("../config");

const Country = db.define(
  "Country",
  {
    country_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    country_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    iso_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    phone_code: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
  },
  {
    tableName: "Country",
    timestamps: false,
    indexes: [{
        unique: true,
        fields: ["country_name", "iso_code"],
      },]
  }
);

module.exports = Country;
