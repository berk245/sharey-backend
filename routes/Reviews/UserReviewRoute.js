const express = require("express");
const router = express.Router();
const UserReview = require("../../database/models/UserReview.model");

module.exports = function () {
  router.post("/", async (req, res) => {
    try {
      const { user_id, reviewed_user_id } = req.body;
      if (user_id == reviewed_user_id) {
        res.status(500).send("Cannot review yourself.");
      }
      await UserReview.create({
        creator_id: user_id,
        ...req.body,
      });
      res.status(200).send({ message: "User review succesfully created." });
    } catch (err) {
      console.log(err);
      if (err.name === "SequelizeUniqueConstraintError") {
        res
          .status(500)
          .send({ error: "You can only leave one review for the same user." });
      }
    }
  });

  router.get("/", async (req, res) => {
    try {
      const { creator_id, reviewed_user_id } = req.query;
      if (!creator_id && !reviewed_user_id) {
        res.status(400).send({ error: "Bad request" });
        return;
      }

      let reviews = await UserReview.findAll({
        where: {
          ...req.query,
        },
      });

      res.status(200).send({ reviews: reviews });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: err.name });
    }
  });
  router.delete("/", async (req, res) => {
    try {
        let deleteSuccess = await UserReview.destroy({
          where: req.query,
        });
        if (deleteSuccess)
          res.status(200).send({ message: "Deleted item review." });
        else
          res
            .status(404)
            .send({ error: "No matching reviews found or nothing to update " });
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.name });
      }
  });
  return router;
};
