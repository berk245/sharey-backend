const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    dialectOptions: {
      socketPath: process.env.MYSQL_SOCKET_PATH
    },
    define: {
      paranoid: true,
      underscore: true
    }
  }
);
db.authenticate()
  .then(() => {
    console.log("Connected to db successfuly");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = db;
