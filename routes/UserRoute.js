const express = require("express");
const router = express.Router();
const User = require("../database/models/User.model");
const Country = require("../database/models/Country.model");
const City = require("../database/models/City.model");
const { Op } = require("sequelize");

module.exports = function () {
  router.get("/", async (req, res) => {
    try {
      const { country_name, city_name, ...otherParams } = req.query;

      const users = await User.findAll({
        where: {
          ...otherParams,
          is_active: true,
        },
        include: [
          {
            model: City,
            attributes: ["city_name"],
            required: true,
            where: {
              city_name: city_name ? city_name : { [Op.ne]: null },
            },
            include: [
              {
                model: Country,
                attributes: ["country_name"],
                where: {
                  country_name: country_name ? country_name : { [Op.ne]: null },
                },
              },
            ],
          },
        ],
        attributes: { exclude: ["password"] },
      });

      res.status(200).json({ users: users });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: err });
    }
  });

  router.post("/update", async (req, res) => {
    try {
      const { user_id, ...fieldsToUpdate } = req.body;
      const [affectedRows] = await User.update(fieldsToUpdate, {
        where: {
          user_id: user_id,
        },
      });
      if (affectedRows) {
        res.status(200).json({ message: "User successfully updated" });
      } else {
        res.status(404).json({ error: "No matching records or no changes." });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: err });
    }
  });

  router.delete("/", async (req, res) => {
    try {
      const { user_id } = req.query;

      const userToDelete = await User.findByPk(user_id);

      if (!userToDelete) {
        res.status(404).send({ error: "No matching user" });
      }

      const [affectedRows] = await User.update(
        {
          is_active: false,
          email: "$deleted_account$:" + userToDelete.email,
        },
        {
          where: {
            user_id: user_id,
          },
        }
      );
      if (affectedRows) {
        res.status(200).json({ message: "User successfully deactivated." });
      } else {
        res.status(404).json({ error: "No matching records or no changes." });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: err.parent.sqlMessage });
    }
  });
  return router;
};
