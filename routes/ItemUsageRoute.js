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
        const { isSuccess, ...data } = await cancelUsageTransaction(
          req,
          "owner"
        );
        if (!isSuccess) {
          res.status(data.code).send({ error: data.message });
          return;
        } else {
          res.status(data.code).send({ message: data.message });
          return;
        }
      }

      let [affectedRows] = await ItemUsage.update(
        {
          status: new_status,
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
    const transaction = await db.transaction();
    try {
      let usageToUpdate = getUsageToUpdate(req)
      if (!usageToUpdate) {
        res.status(404).send({ error: "Usage was not found" });
        return;
      }

      //Transaction begins
      //Update the usage
      let updateUsageSuccess = await usageToUpdate.update(
        {
          status: "cancelled",
        },
        { transaction: transaction }
      );

      if (!updateUsageSuccess) {
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

const getFindUsageWhereClause = ({ usage_id, owner_id, user_id }) => {
  let whereClause = { usage_id: usage_id, status: { [Op.ne]: "active" } };

  if (user_id) whereClause.user_id = user_id;
  else if (owner_id) {
    whereClause = {
      ...whereClause,
      [Op.and]: Sequelize.literal(
        `(SELECT owner_id FROM Item WHERE Item.item_id = ItemUsage.item_id) = ${owner_id}`
      ),
    };
  }
  return whereClause;
};


const getUsageToUpdate = async (req) => {
  return await ItemUsage.findOne({
    where: getFindUsageWhereClause(req.body),
    attributes: [
      "usage_id",
      "user_id",
      "item_id",
      "item_usage_request_id",
      "status",
      "created_at",
    ],
    include: [
      {
        model: Item,
        attributes: ["owner_id"], // Include the owner_id attribute from the Item model
      },
    ],
  });
}