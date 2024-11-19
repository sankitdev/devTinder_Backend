const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const { signupValidate } = require("../utils/signupValidate");
const authRotuer = express.Router();

authRotuer.post("/signup", async (req, res) => {
  // Dont pass req.body directly dont trust it
  const { firstName, age, gender, email, password, skills, photoUrl } =
    req.body;

  try {
    signupValidate(req);
    const emailCheck = await UserModel.findOne({ email: email });
    if (emailCheck) {
      return res.status(404).json({ message: "Email already exists" });
    }
    const hashPass = await bcrypt.hash(password, 10);
    const userData = UserModel({
      firstName,
      age,
      gender,
      email,
      password: hashPass,
      skills,
      photoUrl,
    });

    await userData.save();
    res.send("User is registered");
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(401).send({ message: "Signup error:" + error.message });
  }
});
authRotuer.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(401).send("Invalid Credentials"); // User not found
    }
    const isPassValid = await user.validatePassword(password);
    if (isPassValid) {
      // Create a jwt token
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login Successfull");
    } else {
      return res.status(401).send("Invalid Credentials"); // Password does not match
    }
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    res.status(500).send("Internal server error"); // Send a generic error response
  }
});

module.exports = authRotuer;
