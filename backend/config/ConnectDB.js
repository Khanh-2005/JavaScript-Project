const mongoose = require("mongoose");

const connectDB = async (req, res) => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Todo_App").then;
    console.log("Database connected");
  } catch (error) {
    res.status(400).json({ message: "Not Connected" });
  }
};
connectDB();
