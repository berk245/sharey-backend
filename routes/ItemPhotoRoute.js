const express = require("express");
const router = express.Router();
const ItemPhoto = require("../database/models/ItemPhoto.model");
const Item = require("../database/models/Item.model");
module.exports = function () {
  router.get("/", async (req, res) => {
    try {
      let photos = await ItemPhoto.findAll({
        where: req.query,
      });

      res.status(200).json({ photos: photos });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  });
  router.post("/", async (req, res) => {
    try {
      const { user_id, item_id, photo_url, description } = req.body;

      const item = await Item.findOne({
        where: {
          owner_id: user_id,
          item_id: item_id,
        },
      });

      if (!item) {
        res.status(404).send({ error: "Item not found." });
        return;
      }

      ItemPhoto.create({
        item_id: item_id,
        photo_url: photo_url,
        description: description,
      });

      res.status(200).json({ message: `Item photo created successfully.` });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  });

  router.delete("/", async (req, res) => {
    try {
      const { photo_id, user_id, item_id } = req.body;

      const item = await Item.findOne({
        where: {
          owner_id: user_id,
          item_id: item_id,
        },
      });

      if (!item) {
        res.status(404).send({ error: "Related item not found." });
        return;
      }
      await ItemPhoto.destroy({
        where: {
          photo_id: photo_id,
        },
      });
      res.status(200).json({ message: `Delete successful.` });
    } catch (err) {
      res.status(500).send({ error: err });
    }
  });
  return router;
};
