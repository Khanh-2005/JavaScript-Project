const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Trang chủ
router.get("/", userController.getHomePage);

// Danh sách sản phẩm với bộ lọc
router.get("/products", userController.getProducts);

module.exports = router;
