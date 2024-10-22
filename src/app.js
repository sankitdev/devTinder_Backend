const express = require("express");
const connectDB = require("../src/config/database");
const app = express();
const User = require("./models/user");
// Make sure to connect to database first after then start server.
app.post("/signup", async (req, res) => {
  const userData = User({
    firstName: "Ankit",
    lastName: "Singh",
    email: "ankitsingh@gmail.com",
  });
  try {
    await userData.save();
    res.send("User is registered");
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
