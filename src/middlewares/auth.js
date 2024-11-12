const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Not found Token");
    }
    const decoded = jwt.verify(token, "Ankit@Singh");
    const user = await UserModel.findById(decoded);
    if (!user) throw new Error("Something went wrong");
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
};

module.exports = {
  authUser,
};
