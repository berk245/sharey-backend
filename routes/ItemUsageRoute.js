const express = require("express");
const router = express.Router();
const { Sequelize, Op } = require("sequelize");
const db = require("../database/config");

const ItemUsageRequest = require("../database/models/ItemUsageRequest.model");
const ItemUsage = require("../database/models/ItemUsage.model");
const Item = require("../database/models/Item.model");

module.exports = function () {
  router.get("/", async (req, res) => {
    try {
      let requests = await ItemUsage.findAll({
        where: req.query,
      });
      res.status(200).send({ matches: requests });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Error getting requests" });
    }
  });

  router.get("/to_user_items", async (req, res) => {
    try {
      // Find all ItemUsage entries where the item_id belongs to the user
      const totalUsages = await ItemUsage.findAll({
        where: {
          item_id: {
            [Sequelize.Op.in]: Sequelize.literal(
              "(SELECT item_id FROM Item WHERE owner_id = ?)"
            ),
          },
        },
        replacements: [req.query.user_id],
      });

      res.status(200).send({ matches: totalUsages });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Error getting requests" });
      return;
    }
  });

  router.post("/update_status", async (req, res) => {
    try {
      const { usage_id, owner_id, new_status } = req.body;

      if (new_status === "cancelled") {
        res.status(400).send({ error: "Please use the cancel endpoint." });
        return;
      }

      //Check if the owner_id matches the item
      let usageToUpdate = await ItemUsage.findByPk(usage_id);

      if (!isOwner(usageToUpdate, req)) {
        res.status(403).send({ error: "Not authorized to make this change" });
        return;
      }

      let [affectedRows] = await ItemUsage.update(
        {
          status: new_status,
        },
        {
          where: {
            usage_id: usage_id,
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
      res.status(500).send({ error: err });
    }
  });

  router.post("/cancel", async (req, res) => {
    const transaction = await db.transaction();
    try {
      const { user_id, owner_id, usage_id } = req.body;

      if (user_id && owner_id) {
        res.status(422).send({ error: "Only user_id or owner_id" });
        return;
      }
      let usageToUpdate = await ItemUsage.findByPk(usage_id);
      if (!usageToUpdate) {
        res.status(404).send({ error: "Usage was not found" });
        return;
      }
      if (usageToUpdate.status === "cancelled") {
        res.status(400).send({ error: "Usage is already cancelled" });
        return;
      }
      if (!isUserAuthorized(usageToUpdate, req)) {
        res.status(403).send({ error: "Not authorized to make this change" });
        return;
      }

      //Transaction begins
      try {
        usageToUpdate.status = "cancelled";
        await usageToUpdate.save({ transaction });
      } catch (err) {
        await transaction.rollback();
        res.status(404).send({ error: "Could not update item usage status" });
        return;
      }

      //Find an update the item usage request
      const itemUsageRequestCancel = await ItemUsageRequest.update(
        { status: "cancelled" },
        {
          where: {
            request_id: usageToUpdate.item_usage_request_id,
          },
          transaction: transaction,
        }
      );

      if (!itemUsageRequestCancel) {
        await transaction.rollback();
        res
          .status(404)
          .send({ error: "Could not update item usage request status" });
        return;
      }

      await transaction.commit();
      res.status(200).send({ message: "Usage successfuly cancelled." });
      return;
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      res.status(500).send({ error: err });
    }
  });
  return router;
};

const isUserAuthorized = async (usageToUpdate, req) => {
  let result;

  const { user_id } = req.body;

  console.log(user_id === usageToUpdate.user_id);

  if (user_id) {
    result = user_id === usageToUpdate.user_id;
  } else {
    result = isOwner(usageToUpdate, req.body);
  }

  return result;
};

const isOwner = async (usageToUpdate, { owner_id }) => {
  const item = await Item.findOne({
    where: {
      item_id: usageToUpdate.item_id,
      owner_id: owner_id,
    },
  });

  return item;
};
