const express = require("express");
const profileRouter = express.Router();
const { authUser } = require("../middlewares/auth");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", authUser, (req, res) => {
  try {
    const user = req.user;
    const userData = {
      id: user._id,
      name: user.firstName,
      email: user.email,
      // Add other non-sensitive fields you want to include in the response
    };
    res.json({ message: "User fetched successfully", user: userData });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/update", authUser, async (req, res) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "age",
    "about",
    "skills",
    "photoUrl",
  ];
  try {
    const updates = Object.keys(req.body);
    const isUpdateAllowed = updates.every((keys) =>
      ALLOWED_UPDATES.includes(keys)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update can't be applied to one or more fields");
    }
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    const updatedUser = await user.save();
    res.send(updatedUser);
  } catch (error) {
    res.status(400).json({ message: `Error, ${error.message}` });
  }
});

profileRouter.patch("/profile/password", authUser, async (req, res) => {
  try {
    const allowdFields = ["password", "newpassword"];
    const fieldsToUpdate = Object.keys(req.body);
    const isUpdateAllowed = fieldsToUpdate.every((keys) =>
      allowdFields.includes(keys)
    );
    if (!isUpdateAllowed)
      return res.status(400).json({
        error: "Only 'password' and 'newpassword' fields are allowed.",
      });
    const user = req.user;
    const isPassValid = await user.validatePassword(req.body.password);
    if (!isPassValid) return res.json({ error: "Incorrect current password." });
    const newPassword = req.body.newpassword;
    const newPassHash = await bcrypt.hash(newPassword, 10);
    user.password = newPassHash;
    await user.save();
    res.json({
      message: `${user.firstName}, your password has been changed successfully.`,
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

module.exports = profileRouter;
