const express = require("express");
const userRouter = express.Router();
const UserModel = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");
const { authUser } = require("../middlewares/auth");
const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "gender",
  "skills",
  "about",
  "photoUrl",
];
userRouter.get("/user/requests", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    //Banda login h ya nhi - Done
    const data = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    if (!data) {
      return res.status(404).json({ message: "No request found" });
    }
    res.json({ message: data });
  } catch (error) {
    res.status(400).send("Error:", error.message);
  }
});
userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const data = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA);

    if (!data) {
      return res.status(404).json({ message: "No request found" });
    }
    res.json({ message: data });
  } catch (error) {
    res.status(400).send("Error:", error.message);
  }
});
userRouter.get("/feed", async (req, res) => {
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

module.exports = userRouter;
