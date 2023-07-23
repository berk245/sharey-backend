const express = require("express");
const router = express.Router();
const Item = require("../database/models/Item.model");
const ItemUsageRequest = require("../database/models/ItemUsageRequest.model");
const Sequelize = require("sequelize");
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

  router.get("/", async (req, res) => {
    //Can get all item usage requests made by an user or made to an item
    try {
      let requests = await ItemUsageRequest.findAll({
        where: {
          ...req.query,
        },
      });
      res.status(200).send({ matches: requests });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Error getting requests" });
    }
  });

  router.post("/respond", async (req, res) => {
    try {
      const { request_id, user_id, owner_response } = req.body;

      let [affectedRows] = await ItemUsageRequest.update(
        {
          status: owner_response,
        },
        {
          where: {
            request_id: request_id,
            is_active: 1,
            // Include a subquery to check if the user_id matches the owner_id of the item in the usage request
            // to ensure only the owner of an item can accept or decline
            [Sequelize.Op.and]: Sequelize.literal(
              `(SELECT owner_id FROM Item WHERE Item.item_id = ItemUsageRequest.item_id) = ${user_id}`
            ),
          },
        }
      );
      if (affectedRows)
        res.status(200).send({ message: "Status changed succesfully" });
      else
        res
          .status(404)
          .send({ error: "No matching usage requests or no changes." });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Error getting requests" });
    }
  });

  router.delete("/cancel", async (req, res) => {
    try {
      let [affectedRows] = await ItemUsageRequest.update(
        {
          status: "cancelled",
        },
        {
          where: req.body,
        }
      );
      if (affectedRows) res.status(200).send({ message: "Request cancelled" });
      else
        res
          .status(404)
          .send({ error: "No matching usage requests or no changes." });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Error getting requests" });
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
