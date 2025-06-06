// Import các module cần thiết
const express = require("express");
const app = express();
const cors = require("cors");
// Import file kết nối database
require("./config/ConnectDB");
// Import các routes
const auth = require("./routes/auth");
const list = require("./routes/list");

// Middleware để parse JSON và cho phép CORS
app.use(express.json());
app.use(cors());

// Route test server
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Route test đăng nhập
app.post("/signin", (req, res) => {
  res.send("Đăng nhập thành công");
});

// Sử dụng các routes
app.use("/api/v1", auth); // Routes xử lý authentication
app.use("/api/v2", list); // Routes xử lý todo list

// Khởi động server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
