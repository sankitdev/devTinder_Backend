const express = require("express");
const connectDB = require("../src/config/database");
const app = express();
const User = require("./models/user");
// Make sure to connect to database first after then start server.
app.use(express.json());
app.post("/signup", async (req, res) => {
  const userData = User(req.body);
  try {
    res.send("User is registered");
    await userData.save();
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
