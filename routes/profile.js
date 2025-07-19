const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const isAuth = require("../middleware/isAuth");

// Hiển thị trang hồ sơ
router.get("/profile", isAuth, profileController.getProfilePage);

// Cập nhật hồ sơ
router.post("/profile", isAuth, profileController.updateProfile);

module.exports = router;
