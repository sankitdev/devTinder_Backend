const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const connectDB = require("../src/config/database");
const app = express();
const jwt = require("jsonwebtoken");
const { signupValidate } = require("./utils/signupValidate");
const UserModel = require("./models/user");
const { authUser } = require("../src/middlewares/auth");
app.use(express.json());
app.use(cookieParser());

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});
app.post("/signup", async (req, res) => {
  // Dont pass req.body directly dont trust it
  const { firstName, age, gender, email, password, skills, photoUrl } =
    req.body;
  // Validate Data

  // Encrypt the password

  try {
    signupValidate(req);
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
    console.error("Signup error:", error);

    if (error.message.includes("validation")) {
      res
        .status(400)
        .json({ error: "Validation failed", details: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(401).send("Invalid Credentials"); // User not found
    }
    const isPassValid = await bcrypt.compare(password, user.password);
    if (isPassValid) {
      // Create a jwt token
      const token = jwt.sign({ id: user._id }, "Ankit@Singh");
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

app.patch("/user/:id", async (req, res) => {
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

app.get("/profile", authUser, (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.send("User fetched Sucessfully");
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

connectDB().then(() => {
  console.log("DB Successfully connected");
  app.listen(3000, () => {
    console.log("Port is running on 3000");
  });
});
