const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("../src/config/database");
const authRouter = require("../src/routers/authRouter");
const profileRouter = require("../src/routers/profileRouter");
const userRouter = require("./routers/userRouter");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/user", userRouter);

connectDB().then(() => {
  console.log("DB Successfully connected");
  app.listen(3000, () => {
    console.log("Port is running on 3000");
  });
});
