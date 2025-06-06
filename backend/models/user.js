// Import mongoose để tạo schema
const mongoose = require("mongoose");

// Import model List để tham chiếu
const list = require("./list");

// Schema cho User
const userSchema = new mongoose.Schema({
  // Email của user
  email: {
    type: String,
    required: true,
  },
  // Tên người dùng
  username: {
    type: String,
    required: true,
  },
  // Mật khẩu đã được mã hóa
  password: {
    type: String,
    required: true,
  },
  // Danh sách các task của user
  list: [
    {
      type: mongoose.Types.ObjectId,
      ref: "List",
    },
  ],
});

// Export model User
module.exports = mongoose.model("User", userSchema);
