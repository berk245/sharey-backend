const express = require("express");
const app = express();
const db = require("./database/config");
const bcrypt = require("bcrypt");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.post("/signup", async (req, res) => {
  try {
    const User = require("./database/models/User.model");

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

app.get("/item_photos/:item_id", async (req, res) => {
  const ItemPhoto = require('./database/models/ItemPhoto.model')
  const photos = await ItemPhoto.findAll({
      where:{
          item_id: req.params.item_id
      }
  })

  res.status(200).json({ photos: photos });

});

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}
