const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const sequelize = require('../database/config')

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
    const { isSuccess, ...data } = await cancelUsageTransaction(req, "user");
    if (!isSuccess) {
      res.status(data.code).send({ error: data.message });
      return;
    } else {
      res.status(data.code).send({ message: data.message });
      return;
    }
  });
  return router;
};

const cancelUsageTransaction = async (req, userType = "user") => {
  const { usage_id, owner_id, user_id } = req.body;
  const transaction = await sequelize.transaction();

  try {
    let usageToUpdate;
    if (userType === "owner") {
      usageToUpdate = await ItemUsage.findOne({
        where: {
          usage_id: usage_id,
          [Sequelize.Op.and]: Sequelize.literal(
            `(SELECT owner_id FROM Item WHERE Item.item_id = ItemUsage.item_id) = ${owner_id}`
          ),
        },
        transaction: transaction,
      });
    } else {
      usageToUpdate = await ItemUsage.findOne({
        where: {
          usage_id: usage_id,
          user_id: user_id,
        },
        transaction: transaction,
      });
    }

    if (!usageToUpdate) {
      await transaction.rollback();
      return {
        isSuccess: false,
        code: 404,
        message: "No matching usages.",
      };
    }

    // Update the status
    const [isUpdateItemUsageSuccessful] = await ItemUsage.update(
      {
        status: "cancelled",
      },
      {
        where: {
          usage_id: usage_id,
        },
        transaction: transaction,
      }
    );
    if (!isUpdateItemUsageSuccessful) {
      await transaction.rollback();
      return {
        isSuccess: false,
        code: 500,
        message: "No changes.",
      };
    }

    const [affectedRowsCount] = await ItemUsageRequest.update(
      {
        status: "cancelled",
      },
      {
        where: {
          request_id: usageToUpdate.item_usage_request_id,
        },
        transaction: transaction,
      }
    );


    if (!affectedRowsCount) {
      await transaction.rollback();
      return {
        isSuccess: false,
        code: 500,
        message: "Could not update the ItemUsageRequest table.",
      };
    }

    await transaction.commit();
    return {
      isSuccess: true,
      code: 200,
      message: "Item Usage successfully cancelled.",
    };
  } catch (err) {
    await transaction.rollback();
    console.log("Here", err);
    return {
      isSuccess: false,
      code: 500,
      message: err,
    };
  }
};
