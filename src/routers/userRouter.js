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
userRouter.get("/user/request/pending", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const data = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    const filteredData = data.map((res) => res.fromUserId);
    if (!data) {
      return res.status(404).json({ message: "No request found" });
    }
    res.json({ message: filteredData });
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
    const filteredData = data.map((res) => res.fromUserId);
    res.json({ message: filteredData });
  } catch (error) {
    res.status(400).send("Error:", error.message);
  }
});
userRouter.get("/feed", authUser, async (req, res) => {
  // login in user should not see people with the below conditions:-
  // 1. Accepted Request or reject request
  // 2. Sent Request
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 20 ? 20 : limit;
    const skip = (page - 1) * 10;
    const connectionData = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hideUserFromFeed = new Set();
    connectionData.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    const feedUser = await UserModel.find({
      _id: { $nin: Array.from(hideUserFromFeed) },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    console.log(hideUserFromFeed);
    res.send(feedUser);
  } catch (error) {
    res.status(404).json({ message: "Something is wrong " + error.message });
  }
});

module.exports = userRouter;
