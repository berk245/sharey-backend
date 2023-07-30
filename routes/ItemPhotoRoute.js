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
    // INSERT INTO ItemPhoto (item_id, photo_url, description)
    // SELECT Item.item_id, 'https://example.com/photo1.jpg', 'Photo 1 description'
    // FROM Item
    // WHERE item_id = 1 AND owner_id = 11;

    try {
      const { user_id, item_id, photo_url, description } = req.body;

      const item = await Item.findByPk(item_id);

      if (!item) {
        res.status(404).send({ error: "Item not found." });
        return;
      } else if (item.owner_id != user_id) {
        res.status(401).send({ error: "You are not the owner of the item." });
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
    // DELETE FROM ItemPhoto
    // WHERE photo_id = 5 AND item_id = 1
    //   AND EXISTS (
    //     SELECT 1 FROM Item
    //     WHERE item_id = 1 AND owner_id = 1
    //   );

    try {
      const { photo_id, user_id, item_id } = req.body;

      const item = await Item.findByPk(item_id);

      if (!item) {
        res.status(404).send({ error: "Item not found." });
        return;
      } else if (item.owner_id != user_id) {
        res.status(401).send({ error: "You are not the owner of the item." });
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
      return
    }
  });
  return router;
};
