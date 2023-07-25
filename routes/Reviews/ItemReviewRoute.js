const express = require("express");
const router = express.Router();
const ItemReview = require("../../database/models/ItemReview.model");
const ItemUsage = require("../../database/models/ItemUsage.model");

module.exports = function () {
  router.get("/", async (req, res) => {
    try {
      const { creator_id, reviewed_item_id } = req.query;
      if (!creator_id && !reviewed_item_id) {
        res.status(400).send({ error: "Bad request" });
      }

      let reviews = await ItemReview.findAll({
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

    // INSERT INTO ItemReview (creator_id, reviewed_item_id, item_usage_id, review_text, is_rating_positive)
    // SELECT iu.user_id AS creator_id, iu.item_id, iu.usage_id AS item_usage_id, 'Good stuff' AS review_text, {is_rating_positive} AS is_rating_positive
    // FROM ItemUsage iu
    // WHERE iu.usage_id =  AND iu.user_id = 1;

    try {
      const { creator_id, item_usage_id, review_text, is_rating_positive } =
        req.body;

      const itemUsage = await ItemUsage.findOne({
        where: {
          usage_id: item_usage_id,
          user_id: creator_id,
        },
      });

      if (!itemUsage) {
        res.status(404).json({
          error:
            "ItemUsage not found for the given creator_id and item_usage_id",
        });
        return;
      }

      // itemUsage found, proceed with creating the review
      await ItemReview.create({
        creator_id: itemUsage.user_id,
        reviewed_item_id: itemUsage.item_id,
        item_usage_id: itemUsage.usage_id,
        review_text: review_text,
        is_rating_positive: is_rating_positive,
      });

      res.status(200).json({ message: "Item review succesfully added." });
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        res
          .status(500)
          .send({ error: "You can only leave one review for the same item." });
      } else {
        res.status(500).json({ error: `${err.name}` });
      }
    }
  });

  router.delete("/", async (req, res) => {
    try {
      let deleteSuccess = await ItemReview.destroy({
        where: req.query,
      });
      if (deleteSuccess)
        res.status(200).send({ message: "Deleted item review." });
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
