const express = require("express");
const { authUser } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post(
  "/request/send/:status/:touserId",
  authUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.touserId;
      const status = req.params.status;
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status");
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const isSame = fromUserId.equals(toUserId);
      if (isSame) {
        return res
          .status(404)
          .json({ message: "Error Sending Request Self Send" });
      }
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Already Exists" });
      }
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      res.json({
        message: "Connection Request sent successfully",
      });
    } catch (error) {
      res.status(400).json({ message: `Error, ${error.message}` });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      const loggedUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(404).json({ message: "Invalid Status" + status });
      }
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(404).json({ message: "User not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Request " + status + "successfully" + data });
    } catch (error) {
      res.status(400).json({ message: "Error" + error.message });
    }
  }
);

module.exports = requestRouter;
