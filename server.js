const express = require("express");
const app = express();
const db = require("./database/config");
const associations = require("./database/models/associations");
const authRoute = require("./routes/authRoute");
const ItemRoute = require("./routes/ItemRoute");
const UserRoute = require("./routes/UserRoute");
const ItemUsageRequestRoute = require("./routes/ItemUsageRequestRoute");
const UserReviewRoute = require("./routes/Reviews/UserReviewRoute");
const ItemReviewRoute = require("./routes/Reviews/ItemReviewRoute");
const UserReportRoute = require("./routes/Reports/UserReportRoute");
const ItemReportRoute = require("./routes/Reports/ItemReportRoute");
const ItemUsageReport = require("./routes/Reports/ItemUsageReport");
const ItemPhotoRoute = require("./routes/ItemPhotoRoute");
const ItemUsageRoute = require("./routes/ItemUsageRoute");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/auth", authRoute());
app.use('/item', ItemRoute());
app.use('/user', UserRoute())
app.use('/item_usage_request', ItemUsageRequestRoute())
app.use('/user_review', UserReviewRoute())
app.use('/item_review', ItemReviewRoute())
app.use('/user_report', UserReportRoute())
app.use('/item_report', ItemReportRoute())
app.use('/item_usage_report', ItemUsageReport())
app.use('/item_photo', ItemPhotoRoute())
app.use('/item_usage', ItemUsageRoute())


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


  // Synchronize the models with the database
  // db.sync({ alter: true, drop: false }) // Set force to true only for testing to recreate tables
  // .then(() => {
  //   console.log("Database and tables synced.");
  //   associations()
  // })
  // .catch((err) => console.error("Error syncing database:", err));
  

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}
