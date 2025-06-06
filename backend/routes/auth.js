const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// SIGN UP
router.post("/register", async (req, res) => {
  try {
    // Lấy thông tin từ request body
    const { email, username, password } = req.body;
    // Mã hóa password trước khi lưu vào database
    const hashedPassword = bcrypt.hashSync(password, 10);
    // Tạo user mới với password đã mã hóa
    const user = new User({ email, username, password: hashedPassword });
    // Lưu user vào database
    await user.save().then(() => {
      res.status(200).json({message: "User created successfully"});
    });
  } catch (err) {
    // Nếu email đã tồn tại trong database
    res.status(200).json({ message: "User already exists" });
  }
});

// SIGN IN
router.post("/signin", async (req, res) => {
  try {
    // Log thông tin đăng nhập để debug
    console.log("Login attempt with email:", req.body.email);
    // Tìm user theo email trong database
    const user = await User.findOne({ email: req.body.email });
    console.log("Found user:", user ? "Yes" : "No");
    
    // Kiểm tra user có tồn tại không
    if (!user) {
      return res.status(200).json({ message: "Please Sign Up First" });
    }

    // Log thông tin so sánh password để debug
    console.log("Comparing passwords...");
    console.log("Input password:", req.body.password);
    console.log("Stored password:", user.password);
    
    // So sánh password nhập vào với password đã mã hóa trong database
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    console.log("Password comparison result:", isPasswordCorrect);

    // Kiểm tra password có đúng không
    if (!isPasswordCorrect) {
      return res.status(200).json({ message: "Password is not correct" });
    }
    // Loại bỏ password khỏi response để bảo mật
    const { password, ...others } = user._doc;
    console.log("Login successful, returning user data");
    // Trả về thông tin user (không bao gồm password)
    res.status(200).json({ message: "Login successful", others });
  } catch (err) {
    // Log lỗi nếu có vấn đề xảy ra
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
