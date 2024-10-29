const express = require("express");
const profileRouter = express.Router();
const { authUser } = require("../middlewares/auth");

profileRouter.get("/profile", authUser, (req, res) => {
  try {
    const user = req.user;
    res.send("User fetched Sucessfully" + user);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log(id, data);

  try {
    const ALLOWED_UPDATES = [
      "id",
      "firstName",
      "lastName",
      "photoUrl",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed for one or more fields.");
    }
    if (data?.skills.length > 5) {
      throw new Error("Can't add more than 5 skills");
    }
    const user = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).send("User not found");
    res.send("User updated successfully");
  } catch (error) {
    res.status(500).send("Update Failed: " + error);
  }
});

module.exports = profileRouter;
