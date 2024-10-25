const express = require("express");
const connectDB = require("../src/config/database");
const app = express();
const UserModel = require("./models/user");
const { authAdmin, authTest } = require("./middlewares/auth");
// Make sure to connect to database first after then start server.
app.use(express.json());
app.get("/test", (req, res) => {
  try {
    throw new Error("Apple is here");
    res.send("Somethig wromg");
  } catch (error) {
    // console.error("Error is here bro", error);
    res.status(500).send("something went wrong");
  }
});
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});
app.post("/signup", async (req, res) => {
  const userData = UserModel(req.body);
  try {
    res.send("User is registered");
    await userData.save();
  } catch (error) {
    console.error("Error", error);
  }
});

app.post("/user", async (req, res) => {
  const users = await UserModel.findOne(req.body);
  console.log(users);
  res.send(users);
});
app.get("/feed", async (req, res) => {
  const users = await UserModel.find({});
  try {
    if (!users) {
      res.status(404).send("No user found");
    } else {
      res.send(users);
    }
  } catch (error) {
    console.error("Error", error);
  }
});
connectDB().then(() => {
  console.log("DB Successfully connected");
  app.listen(3000, () => {
    console.log("Port is running on 3000");
  });
});
