const express = require("express");
const router = express.Router();
const ItemUsage = require("../../database/models/ItemUsage.model");
const ItemUsageReport = require("../../database/models/ItemUsageReport.model");
const Item = require("../../database/models/Item.model");

module.exports = function () {
  router.get("/", async (req, res) => {
    try {
      let reports = await ItemUsageReport.findAll({
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

  router.post("/", async (req, res) => {
    try {
      const { creator_id, item_usage_id, report_text } = req.body;

      const itemUsage = await ItemUsage.findByPk(item_usage_id);
      if (!itemUsage) {
        res.status(404).json({
          error: "ItemUsage not found",
        });
        return;
      }

      if(itemUsage.status === 'scheduled'){
        res.status(404).json({
          error: "Cannot report a scheduled item usage.",
        });
        return;
      }

      //The creator has to be either the owner of the item or the borrower
      const { item_id, user_id } = itemUsage;
      const item = await Item.findByPk(item_id);
      if (!(user_id === creator_id || item?.owner_id === creator_id)) {
        res
          .status(403)
          .send({ error: "You are not authorized to leave this review." });
        return;
      }

      await ItemUsageReport.create({
        creator_id: creator_id,
        reported_usage_id: item_usage_id,
        report_text: report_text,
      });

      res
        .status(200)
        .send({ message: "Item usage report succesfully created" });
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        res.status(500).send({ error: "You can report a usage only once." });
      } else {
        res.status(500).json({ error: err });
      }
    }
  });

  router.delete("/", async (req, res) => {
    try {
      let deleteSuccess = await ItemUsageReport.destroy({
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
