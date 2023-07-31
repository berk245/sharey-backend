const express = require("express");
const router = express.Router();
const Item = require("../database/models/Item.model");
const getMatchingItems = require("../helpers/getMatchingItems");
const updateItem = require("../helpers/updateItem");
const ItemUsageRequest = require("../database/models/ItemUsageRequest.model");
const { Op, fn } = require("sequelize");
const User = require("../database/models/User.model");
const City = require("../database/models/City.model");
const Country = require("../database/models/Country.model");

module.exports = function () {
  router.get("/get_by_id", async (req, res) => {
    try {
      const item = await Item.findByPk(req.query.item_id);
      res.status(200).send({ item: item });
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

  router.get("/check_availability", async (req, res) => {
    try {
      const { item_id, date_to_use } = req.query;

      const reservations = await ItemUsageRequest.findAll({
        where: {
          item_id: item_id,
          date_to_use: new Date(date_to_use),
          status: "accepted",
        },
      });

      res.status(200).send({ is_available: !reservations.length });
    } catch (err) {
      res.status(500).send({ error: "Error" });
      return;
    }
  });

  router.get("/available_items", async (req, res) => {
    try {
      const {
        date_to_use,
        city_name,
        country_name,
        item_id,
        ...search_params
      } = req.query;

      if (item_id) {
        res
          .status(422)
          .status({
            error:
              "Bad request. For id based search, please use get_by_id endpoint",
          });
        return;
      }
      const reservedItemIds = await getReservedItemIds(date_to_use);

      const availableItems = await Item.findAll({
        attributes: [
          "item_id",
          "owner_id",
          "category_id",
          "item_name",
          "item_description",
          "created_at",
          "updated_at",
          "is_active",
        ],

        where: {
          ...search_params,
          item_id: {
            [Op.notIn]: reservedItemIds, // Exclude items with accepted ItemUsageRequests
          },
        },
        include: [
          {
            model: User,
            attributes: ["user_id", "city_id"],
            required: true,
            include: [
              {
                model: City,
                attributes: ["city_name", "city_id"],
                required: true,
                where: {
                  city_name: city_name ? city_name : { [Op.ne]: null },
                },
                include: [
                  {
                    model: Country,
                    attributes: ["country_name", "country_id"],
                    where: {
                      country_name: country_name
                        ? country_name
                        : { [Op.ne]: null },
                    },
                  },
                ],
              },
            ],
          },
        ],
      });

      console.log(availableItems.length);

      res.status(200).send({ items: availableItems });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Error" });
      return;
    }
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

      if (!isDeleteSuccess) {
        res.status(404).json({ error: `Could not find the item-owner pair.` });
        return;
      }
      res.status(200).json({ message: `Delete successful.` });
    } catch (err) {
      console.log(err);
      res.status(500).send("Could not delete");
    }
  });
  return router;
};

const getReservedItemIds = async (date_to_use) => {
  if (!date_to_use) return [];

  const itemsWithAcceptedRequests = await ItemUsageRequest.findAll({
    attributes: ["item_id"],
    where: {
      date_to_use: new Date(date_to_use), // Replace this with the desired date
      status: "accepted",
    },
    raw: true,
  });

  return itemsWithAcceptedRequests.map((item) => item.item_id);
};
