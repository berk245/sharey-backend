const express = require("express");
const app = express();
const db = require("./database/config");

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}
