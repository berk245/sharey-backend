const express = require("express");
const router = express.Router();
const ItemReport = require("../database/models/ItemReport.model");
const ItemUsage = require("../database/models/ItemUsage.model");

module.exports = function () {
  router.get("/", async (req, res) => {
    try {
      const { creator_id, reported_item_id } = req.query;
      if (!creator_id && !reported_item_id) {
        res.status(400).send({ error: "Bad request" });
      }

      let reviews = await ItemReport.findAll({
        where: {
          ...req.query,
        },
      });

      res.status(200).send({ reviews: reviews });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: err.name });
    }
  });

  router.post("/", async (req, res) => {
    try {
      await ItemReport.create(req.body);
      res.status(200).send({ message: "Item report succesfully created." });
    } catch (err) {
      console.log(err);
      if (err.name === "SequelizeUniqueConstraintError") {
        res
          .status(500)
          .send({ error: "You can only leave one report for the same item." });
      }else{
        res
          .status(500)
          .send({ error: "Could not add the report." });
      }
    }
  });


  router.delete("/", async (req, res) => {
    try {
      let deleteSuccess = await ItemReport.destroy({
        where: req.query,
      });
      if (deleteSuccess)
        res.status(200).send({ message: "Deleted item report." });
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
