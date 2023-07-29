const express = require("express");
const router = express.Router();
const Item = require("../database/models/Item.model");
const ItemUsageRequest = require("../database/models/ItemUsageRequest.model");
const Sequelize = require("sequelize");
const db = require("../database/config");
const ItemUsage = require("../database/models/ItemUsage.model");

module.exports = function () {
  router.post("/create", async (req, res) => {
    try {
      const { user_id, item_id, date_from, date_to, request_message } =
        req.body;

      //Add Item check to prevent requests to items that do not exist
      const item = await Item.findOne({
        where: {
          item_id: item_id,
        },
      });
      if (!item) {
        res.status(404).send({ error: "Item doesn not exist" });
      }

      await ItemUsageRequest.create({
        user_id: user_id,
        item_id: item_id,
        date_from: date_from,
        date_to: date_to,
        request_message: request_message,
      });

      res.status(200).send({ message: "Item usage request successful" });
    } catch (err) {
      res.status(500).send({ error: "Could bot create the usage request" });
    }
  });

  router.get("/", async (req, res) => {
    //Can get all item usage requests made by an user or made to an item
    try {
      let requests = await ItemUsageRequest.findAll({
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
      // Find all ItemUsageRequest entries where the item_id belongs to the user
      const allRequests = await ItemUsageRequest.findAll({
        where: {
          item_id: {
            [Sequelize.Op.in]: Sequelize.literal(
              "(SELECT item_id FROM Item WHERE owner_id = ?)"
            ),
          },
        },
        replacements: [req.query.user_id],
      });

      res.status(200).send({ matches: allRequests });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Error getting requests" });
    }
  });

  router.post("/respond", async (req, res) => {
    try {
      await updateItemUsageRequest(req, res);
      return;
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Error getting requests" });
    }
  });

  router.delete("/cancel", async (req, res) => {
    try {
      let [affectedRows] = await ItemUsageRequest.update(
        {
          status: "cancelled",
        },
        {
          where: req.body,
        }
      );
      if (affectedRows) res.status(200).send({ message: "Request cancelled" });
      else
        res
          .status(404)
          .send({ error: "No matching usage requests or no changes." });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "Error getting requests" });
    }
  });

  return router;
};

const acceptRequestTransaction = async (body) => {
  const { request_id, user_id } = req.body;
  const transaction = await sequelize.transaction();

  try {
    //Update the ItemUsageRequest

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

const updateItemUsageRequest = async (req, res) => {
  const { request_id, user_id, owner_response } = req.body;

  const usageToUpdate = await getItemUsageRequest(request_id);

  if (owner_response === "accepted" || owner_response === 2) {
    const transaction = await db.transaction();
    let isRequestUpdated = await updateQuery(req, transaction);

    if (!isRequestUpdated) {
      await transaction.rollback();
      res.status(404).send({ error: "Nothing to update." });
      return;
    }

    //Create a new ItemUsage
    let isItemUsageCreated = await ItemUsage.create(
      {
        user_id: usageToUpdate.user_id,
        item_id: usageToUpdate.item_id,
        item_usage_request_id: usageToUpdate.request_id,
      },
      { transaction: transaction }
    );

    if (!isItemUsageCreated) {
      await transaction.rollback();
      res.status(404).send({ error: "Item Usage could not be created." });
      return;
    }

    await transaction.commit();
    res.status(200).send({ message: "Update successful." });
    return;
  } else if (
    (owner_response === "cancelled" || owner_response === 4) &&
    usageToUpdate.status === "accepted"
  ) {
    const transaction = await db.transaction();
    let isUpdate = await updateQuery(req, transaction);

    if (!isUpdate) {
      await transaction.rollback();
      res.status(404).send({ error: "Nothing to update." });
      return;
    }

    //Cancel the ItemUsage
    let [cancelItemUsage] = await ItemUsage.update(
      {
        status: "cancelled",
      },
      {
        where: {
          usage_id: usageToUpdate.usage_id,
        },
        transaction: transaction,
      }
    );
    if (!cancelItemUsage) {
      await transaction.rollback();
      res.status(404).send({ error: "Nothing to update." });
      return;
    }
    await transaction.commit();
    res.status(200).send({ message: "Update successful." });
  } else {
    let isUpdate = await updateQuery(req);
    if (isUpdate) {
      res.status(200).send({ message: "Update successful." });
      return;
    } else {
      res.status(404).send({ error: "Nothing to update." });
    }
  }
  return;
};

const updateQuery = async (req, transaction) => {
  const { request_id, user_id, owner_response } = req.body;

  let [updateSuccess] = await ItemUsageRequest.update(
    {
      status: owner_response,
    },
    {
      where: {
        request_id: request_id,
        // Include a subquery to check if the user_id matches the owner_id of the item in the usage request
        // to ensure only the owner of an item can accept or decline
        [Sequelize.Op.and]: Sequelize.literal(
          `(SELECT owner_id FROM Item WHERE Item.item_id = ItemUsageRequest.item_id) = ${user_id}`
        ),
      },
      transaction: transaction ? transaction : null,
    }
  );

  return updateSuccess;
};

const getItemUsageRequest = async (request_id) => {
  let request = await ItemUsageRequest.findByPk(request_id);

  return request;
};
