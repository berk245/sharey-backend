const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const ItemUsageRequest = require("../database/models/ItemUsageRequest.model");
const ItemUsage = require("../database/models/ItemUsage.model");

module.exports = function () {
  router.get("/", async (req, res) => {
    try {
      let requests = await ItemUsage.findAll({
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
    }
  });

  router.post("/update_status", async (req, res) => {
    try {
      const { usage_id, owner_id, status } = req.body;

      let [affectedRows] = await ItemUsage.update(
        {
          status: status,
        },
        {
          where: {
            usage_id: usage_id,
            // Include a subquery to check if the user_id matches the owner_id of the item in the usage request
            // to ensure only the owner of an item can accept or decline
            [Sequelize.Op.and]: Sequelize.literal(
              `(SELECT owner_id FROM Item WHERE Item.item_id = ItemUsage.item_id) = ${owner_id}`
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
      res.status(500).send({ error: err });
    }
  });

  router.post("/cancel", async (req, res) => {
    const { usage_id, user_id } = req.body;

    const transaction = await sequelize.transaction();
    try {
      const usageToUpdate = await ItemUsage.findOne(
        {
          where: {
            usage_id: usage_id,
            user_id: user_id,
          },
        },
        { transaction: transaction }
      );

      if (!usageToUpdate) {
        await transaction.rollback();
        res.status(404).send({ error: "No matching usages." });
        return;
      }

      // Update the status
      const [affectedRows1] = await ItemUsage.update(
        {
          status: "cancelled",
        },
        {
          where: {
            usage_id: usage_id,
          },
        },
        {
          transaction: transaction,
        }
      );
      console.log(affectedRows1);
      if (!affectedRows1) {
        await transaction.rollback();
        res.status(500).send({ error: "No changes." });
        return;
      }

      console.log("Updated the table");

      const [updateConnectedTable] = await ItemUsageRequest.update(
        {
          status: "cancelled",
        },
        {
          where: {
            request_id: usageToUpdate.item_usage_request_id,
          },
        },
        {
          transaction: transaction,
        }
      );

      if (!updateConnectedTable) {
        await transaction.rollback();
        res
          .status(500)
          .send({ error: "Could not update the ItemUsageRequest." });
        return;
      }
      console.log("Updated the corresponding table");

      await transaction.commit();
      res.status(200).send({ message: "Item Usage successfully cancelled" });
      return
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      res.status(500).send({ error: err });
    }
  });
  return router;
};
