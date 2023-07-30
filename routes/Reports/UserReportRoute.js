const express = require("express");
const router = express.Router();
const UserReport = require("../../database/models/UserReport.model");

module.exports = function () {
  router.post("/", async (req, res) => {
    try {
      const { creator_id, reported_user_id } = req.body;
      if (creator_id == reported_user_id) {
        res.status(500).send("Cannot report yourself.");
      }
      console.log(req.body);
      await UserReport.create({
        creator_id: creator_id,
        ...req.body,
      });
      res.status(200).send({ message: "User report succesfully created." });
    } catch (err) {
      console.log(err);
      if (err.name === "SequelizeUniqueConstraintError") {
        res
          .status(500)
          .send({ error: "You can only leave one report for the same user." });
      }
    }
  });
  router.get("/", async (req, res) => {
    try {
      const { creator_id, reported_user_id } = req.query;
      if (!creator_id && !reported_user_id) {
        res.status(400).send({ error: "Bad request" });
        return
      }

      let reports = await UserReport.findAll({
        where: {
          ...req.query,
        },
      });

      res.status(200).send({ reports: reports });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: err.name });
    }
  });
  router.delete("/", async (req, res) => {
    try {
        let deleteSuccess = await UserReport.destroy({
          where: req.query,
        });
        if (deleteSuccess)
          res.status(200).send({ message: "Deleted user report." });
        else
          res
            .status(404)
            .send({ error: "No matching reviews found or nothing to update " });
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.name });
      }
  });
  return router;
};
