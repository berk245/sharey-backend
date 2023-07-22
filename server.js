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

app.get("/item_photos", async (req, res) => {
  const ItemPhoto = require('./database/models/ItemPhoto.model')

  const {item_id} = req.query

  const photos = await ItemPhoto.findAll({
      where:{
          item_id: item_id
      }
  })

  res.status(200).json({ photos: photos });

});

app.get("/item_reports", async (req, res) => {
  const ItemReport = require('./database/models/ItemReport.model')
  
  const {item_id} = req.query
  const reports = await ItemReport.findAll({
      where:{
          reported_item_id: item_id
      }
  })

  res.status(200).json({ reports: reports });

});

app.get("/item_reviews", async (req, res) => {
  const ItemReview = require('./database/models/ItemReview.model')
  
  const {item_id} = req.query
  const reviews = await ItemReview.findAll({
      where:{
          reviewed_item_id: item_id
      }
  })

  res.status(200).json({ reviews: reviews });

});

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}
