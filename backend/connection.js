const mongoose = require("mongoose");
const URI =
  "";

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("Could not connect to MongoDB", err);
  }
};

module.exports = connectDB;
