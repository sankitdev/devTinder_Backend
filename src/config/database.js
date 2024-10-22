const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ankit:ankit123@testdb.90zdu.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
