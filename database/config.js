const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  }
);
db.authenticate()
  .then(() => {
    console.log("Connected to db successfuly");
  })
  .catch((err) =>
    console.log(err)
  );

module.exports = db;