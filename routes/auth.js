const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const isAuth = require("../middleware/isAuth");

// Login page
router.get("/login", authController.getLoginPage);

// Login process
router.post("/login", authController.login);

// Register page
router.get("/register", authController.getRegisterPage);

// Register process
router.post("/register", authController.register);

// Logout
router.get("/logout", authController.logout);

module.exports = router;
