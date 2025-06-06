// Import các module cần thiết
const router = require("express").Router();
const List = require("../models/list");
const User = require("../models/user");

// Route tạo task mới
router.post("/addTask", async (req, res) => {
  try {
    // Lấy thông tin từ request body
    const { title, body, id } = req.body;
    // Tìm user theo id
    const existingUser = await User.findById(id);
    if (existingUser) {
      // Tạo task mới
      const list = new List({ title, body, user: existingUser });
      await list.save();
      // Thêm task vào danh sách của user
      existingUser.list.push(list);
      await existingUser.save();
      res.status(200).json({ list });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route cập nhật task
router.put("/updateTask/:id", async (req, res) => {
  try {
    // Lấy thông tin từ request body
    const { title, body} = req.body;
    // Tìm và cập nhật task
    const list = await List.findByIdAndUpdate(req.params.id, { title, body });
    list.save().then(() => res.status(200).json({ message: "Task Updated" }));
  } catch (error) {
    console.log(error);
  }
});

// Route xóa task
router.delete("/deleteTask/:id", async (req, res) => {
  try {
    // Lấy user id từ request body
    const { id } = req.body;
    // Xóa task khỏi danh sách của user
    const existingUser = await User.findOneAndUpdate(
      { _id: id },
      { $pull: { list: req.params.id } }
    );
    if (existingUser) {
      // Xóa task từ database
      await List.findByIdAndDelete(req.params.id).then(() =>
        res.status(200).json({ message: "Task Deleted" })
      );
    }
  } catch (error) {
    console.log(error);
  }
});

// Route lấy danh sách task
router.get("/getTask", async (req, res) => {
  try {
    // Lấy user id từ query
    const userId = req.query.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    // Tìm user và populate danh sách task
    const user = await User.findById(userId).populate('list');
    if (user && user.list) {
      res.status(200).json({ list: user.list });
    } else {
      res.status(200).json({ list: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
