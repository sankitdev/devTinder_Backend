const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("../src/config/database");
const authRouter = require("../src/routers/authRouter");
const profileRouter = require("../src/routers/profileRouter");
const userRouter = require("./routers/userRouter");
const requestRouter = require("./routers/requestRouter");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);

connectDB().then(() => {
  console.log("DB Successfully connected");
  app.listen(3000, () => {
    console.log("Port is running on 3000");
  });
});
