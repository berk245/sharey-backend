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
      const { user_id, item_id, date_to_use, request_message } =
        req.body;

      //Add Item check to prevent requests to items that do not exist
      const item = await Item.findOne({
        where: {
          item_id: item_id,
        },
      });
      if (!item) {
        res.status(404).send({ error: "Item doesn not exist" });
        return;
      }

      await ItemUsageRequest.create({
        user_id: user_id,
        item_id: item_id,
        date_to_use: date_to_use,
        request_message: request_message,
      });

      res.status(200).send({ message: "Item usage request successful" });
    } catch (err) {
      res.status(500).send({ error: "Could bot create the usage request" });
      return;
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
      res.status(500).send({ error: err });
      return;
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
      res.status(500).send({ error: err });
      return;
    }
  });

  router.post("/respond", async (req, res) => {
    try {
      await updateItemUsageRequest(req, res);
      return;
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: err });
      return;
    }
  });

  router.delete("/cancel", async (req, res) => {
    try {
      const { owner_id, requester_id, request_id, ...params } = req.body;

      const IUR = await ItemUsageRequest.findByPk(request_id);

      if (!IUR) {
        res.status(404).send({ error: "No matching requests to cancel." });
        return;
      }

      let affectedRows;

      if (owner_id) {
        const reqItem = await Item.findOne({
          where: {
            item_id: IUR.item_id,
            owner_id: owner_id,
          },
        });
        if (!reqItem) {
          res
            .status(403)
            .send({ error: "Not authorized to cancel the request." });
          return;
        }
        [affectedRows] = await ItemUsageRequest.update(
          {
            status: "cancelled",
          },
          {
            where: {
              request_id: request_id,
            },
          }
        );
      } else if (requester_id) {
        [affectedRows] = await ItemUsageRequest.update(
          {
            status: "cancelled",
          },
          {
            where: {
              request_id: request_id,
              user_id: requester_id,
            },
          }
        );
      }

      if (affectedRows) res.status(200).send({ message: "Request cancelled" });
      else
        res
          .status(404)
          .send({ error: "No matching usage requests or no changes." });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: err });
    }
  });

  return router;
};

const updateItemUsageRequest = async (req, res) => {
  const { request_id, user_id, owner_response } = req.body;

  if (owner_response === "cancelled" || owner_response === 4) {
    res
      .status(400)
      .send({
        error: "Please use dedicated cancel endpoint to cancel a request",
      });
    return;
  }

  const usageRequestToUpdate = await getItemUsageRequest(request_id);

  if (!usageRequestToUpdate) {
    res.status(404).send({ error: "No matching requests." });
    return;
  }

  if (!isOwner(usageRequestToUpdate, user_id)) {
    res.status(403).send({ error: "Unauthorized" });
    return;
  }

  //These actions can only be done by the owner of the item
  if (owner_response === "declined" || owner_response === 3)
    return await declineRequest(req, res, usageRequestToUpdate);
  else if (owner_response === "accepted" || owner_response === 2)
    return await acceptRequest(req, res, usageRequestToUpdate);
  else res.status(400).send({ error: "Pending status not settable." });
};

const getItemUsageRequest = async (request_id) => {
  let request = await ItemUsageRequest.findByPk(request_id);
  return request;
};

const acceptRequest = async (req, res, usageRequestToUpdate) => {
  const transaction = await db.transaction();

  //Check if there are any reservations made for that date

  let reservations = await ItemUsageRequest.findAll({
    where:{
      item_id: usageRequestToUpdate.item_id,
      date_to_use: usageRequestToUpdate.date_to_use,
      status: 'accepted'
    }
  })

  if(reservations.length){
    res.status(400).send({error: 'Item is reserved'})
    return
  }

  let isRequestUpdated = await updateQuery(req, transaction);

  if (!isRequestUpdated) {
    await transaction.rollback();
    res.status(404).send({ error: "Nothing to update." });
    return;
  }

  //Create a new ItemUsage
  let isItemUsageCreated = await ItemUsage.create(
    {
      user_id: usageRequestToUpdate.user_id,
      item_id: usageRequestToUpdate.item_id,
      item_usage_request_id: usageRequestToUpdate.request_id,
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
};

const declineRequest = async (req, res, usageRequestToUpdate) => {
  let isUpdateSuccess = await usageRequestToUpdate.update({
    status: "declined",
  });

  isUpdateSuccess
    ? res.status(200).send({ message: "Request successfuly declined" })
    : res.status(500).send({ error: "Could not make the update." });
  return;
};

const cancelRequest = async (req, res, usageToUpdate) => {
  if (usageToUpdate.status === "accepted") {
    res.status(400).send({
      error:
        "Cannot cancel an accepted request. Please cancel the related item usage entry.",
    });
    return;
  }

  let isUpdate = await updateQuery(req);

  if (!isUpdate) {
    await transaction.rollback();
    res.status(404).send({ error: "Nothing to update." });
    return;
  }
};

const updateQuery = async (req, transaction) => {
  const { request_id, owner_response } = req.body;

  let [updateSuccess] = await ItemUsageRequest.update(
    {
      status: owner_response,
    },
    {
      where: {
        request_id: request_id,
      },
      transaction: transaction ? transaction : null,
    }
  );

  return updateSuccess;
};

const isOwner = async (usageRequestToUpdate, user_id) => {
  //Get the owner

  const item = Item.findOne({
    where: {
      item_id: usageRequestToUpdate.item_id,
      owner_id: user_id,
    },
  });

  return item;
};
