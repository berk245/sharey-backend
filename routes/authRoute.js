const express = require("express");
const router = express.Router();
const User = require("../database/models/User.model");
const bcrypt = require("bcrypt");
const validateLogin = require('../helpers/validateLogin')
module.exports = function () {
  router.post("/signup", async (req, res) => {
    try {
      const { email, password, name, last_name, city } = req.body;

      let hashedPassword = await bcrypt.hash(password, 13); //

      await User.create({
        email: email,
        password: hashedPassword,
        name: name,
        last_name: last_name,
        city: city,
      });

      res.status(200).json({ signupSuccess: true });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).send({ error: "Missing required fields" });
        return;
      }

      let validatedUser = await validateLogin(email, password);
      if (!validatedUser) {
        res
          .status(422)
          .send({ error: "Email password combination does not exist." });
        return;
      }

      res.status(200).json({
        loginSuccess: true,
        email: email,
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  });
  return router;
};
