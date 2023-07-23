const express = require("express");
const router = express.Router();
const Item = require("../database/models/Item.model");
const ItemUsageRequest = require("../database/models/ItemUsageRequest.model");
const getMatchingItems = require("../helpers/getMatchingItems");
const updateItem = require("../helpers/updateItem");

module.exports = function () {
  router.post("/create", async (req, res) => {
    try {
      const { user_id, item_id, date_from, date_to, request_message } =
        req.body;

      //Add Item check to prevent requests to items that do not exist
      const item = await Item.findOne({
        where: {
          item_id: item_id,
        },
      });
      if (!item) {
        res.status(404).send({ error: "Item doesn not exist" });
      }

      await ItemUsageRequest.create({
        user_id: user_id,
        item_id: item_id,
        date_from: date_from,
        date_to: date_to,
        request_message: request_message,
      });

      res.status(200).send({ message: "Item usage request successful" });
    } catch (err) {
      res.status(500).send({ error: "Could bot create the usage request" });
    }
  });
  //   router.post("/add", async (req, res) => {
  //     try {
  //       const { user_id, category_id, item_name, item_description } = req.body;

  //       await Item.create({
  //         owner_id: user_id,
  //         category_id: category_id,
  //         item_name: item_name,
  //         item_description: item_description,
  //       });

  //       res.status(200).json({ message: `${item_name} created successfully.` });
  //     } catch (err) {
  //       console.log(err);
  //       res.status(500).send("Server error");
  //     }
  //   });
  //   router.post("/update", async (req, res) => {
  //     const result = await updateItem(req.body);
  //     if (!result) res.status(500).send("Could not update");
  //     else res.status(200).json({ message: `Update successful.` });
  //   });
  //   router.delete("/", async (req, res) => {
  //     try {
  //       const { item_id, user_id } = req.body;

  //       await Item.destroy({
  //         where: {
  //           item_id: item_id,
  //           owner_id: user_id,
  //         },
  //       });
  //       res.status(200).json({ message: `Delete successful.` });
  //     } catch (err) {
  //       res.status(500).send("Could not delete");
  //     }
  //   });
  return router;
};
