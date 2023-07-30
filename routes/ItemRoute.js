const express = require("express");
const router = express.Router();
const Item = require("../database/models/Item.model");
const getMatchingItems = require("../helpers/getMatchingItems");
const updateItem = require("../helpers/updateItem");

module.exports = function () {
  router.get("/", async (req, res) => {
    try {
      let params = req.query;
      const items = await getMatchingItems(params);

      res.status(200).json({ items: items });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  });
  router.post("/", async (req, res) => {
    try {
      const { user_id, category_id, item_name, item_description } = req.body;

      await Item.create({
        owner_id: user_id,
        category_id: category_id,
        item_name: item_name,
        item_description: item_description,
      });

      res.status(200).json({ message: `${item_name} created successfully.` });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  });
  router.post("/update", async (req, res) => {
    const result = await updateItem(req.body);
    if (!result) res.status(500).send("Could not update");
    else res.status(200).json({ message: `Update successful.` });
  });
  router.delete("/", async (req, res) => {
    try {
      const { item_id, user_id } = req.body;

     const isDeleteSuccess = await Item.destroy({
        where: {
          item_id: item_id,
          owner_id: user_id,
        },
      });

      if(!isDeleteSuccess){
        res.status(404).json({ error: `Could not find the item-owner pair.` });
        return
      }
      res.status(200).json({ message: `Delete successful.` });
    } catch (err) {
      console.log(err);
      res.status(500).send("Could not delete");
    }
  });
  return router;
};
