const express = require("express");
const router = express.Router();
const ItemPhoto = require('../database/models/ItemPhoto.model')


module.exports = function () {
  router.get("/item_photos/:item_id", async (req, res) => {
    const photos = await ItemPhoto.findAll({
        where:{
            item_id: req.params.item_id
        }
    })

    res.status(200).json({ words: words });

  });

  return router;
};
