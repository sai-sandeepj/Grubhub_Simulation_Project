const mongoose = require("mongoose");
const URI =
  "mongodb+srv://sandeep:7777@sandeep-bpru9.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("Could not connect to MongoDB", err);
  }
};

module.exports = connectDB;
