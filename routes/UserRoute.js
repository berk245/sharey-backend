const express = require("express");
const router = express.Router();
const User = require("../database/models/User.model");
module.exports = function () {
  router.get("/", async (req, res) => {
    try {
      const users = await User.findAll({
        where: {
            ...req.query,
            is_active: true
        },
        attributes: { exclude: ["password"] },
      });

      res.status(200).json({ users: users });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
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
      res.status(500).send({ error: err.parent.sqlMessage });
    }
  });

  router.delete("/", async (req, res) => {
    try {
      const { user_id } = req.query;

      const userToDelete = await User.findByPk(user_id)

      if(!userToDelete){
        res.status(404).send({error: 'No matching user'})
      }

      const [affectedRows] = await User.update(
        {
          is_active: false,
          email: '$deleted_account$:' + userToDelete.email
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
