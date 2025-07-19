const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const isAuth = require("../middleware/isAuth");

// View cart
router.get("/", isAuth, cartController.getCart);

// Add to cart
router.post("/add/:productId", isAuth, cartController.addToCart);

// Update quantity
router.put("/update/:productId", isAuth, cartController.updateCart);

// Remove from cart
router.delete("/remove/:productId", isAuth, cartController.removeFromCart);

// Checkout page
router.get("/checkout", isAuth, cartController.getCheckout);

module.exports = router;
