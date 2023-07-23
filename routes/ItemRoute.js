const express = require("express");
const router = express.Router();
const Item = require("../database/models/Item.model");
const getMatchingItems = require('../helpers/getMatchingItems')
module.exports = function () {
  router.get("/", async(req, res) => {
    try {
      let params = req.query;
      const items = await getMatchingItems(params)

      res.status(200).json({ items: items });
    } catch (err) {
      console.log(err);
    }
  });
  router.post("/add", async (req, res) => {
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

  // Search and filter item
  // Update item
  // Delete Item

  // router.get("/item_photos/:item_id", async (req, res) => {
  //   const photos = await ItemPhoto.findAll({
  //       where:{
  //           item_id: req.params.item_id
  //       }
  //   })

  //   res.status(200).json({ words: words });

  // });

  return router;
};
