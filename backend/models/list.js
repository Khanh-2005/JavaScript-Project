// Import mongoose để tạo schema
const mongoose = require("mongoose");

// Schema cho Task
const listSchema = new mongoose.Schema(
  {
    // Tiêu đề của task
    title: {
      type: String,
      required: true,
    },
    // Nội dung chi tiết của task
    body: {
      type: String,
      required: true,
    },
    // User sở hữu task
    user: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  // Tự động thêm timestamps (createdAt, updatedAt)
  {
    timestamps: true,
  }
);

// Export model List
module.exports = mongoose.model("List", listSchema);
