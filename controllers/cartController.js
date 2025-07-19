const Product = require("../models/Product");

// Xem giỏ hàng
exports.getCart = async (req, res) => {
  try {
    // Lấy giỏ hàng từ session
    const cart = req.session.cart || [];

    // Lấy thông tin chi tiết sản phẩm từ database
    const cartItems = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        return {
          product,
          quantity: item.quantity,
        };
      })
    );

    // Tính tổng tiền
    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    res.render("user/cart", {
      cartItems,
      total,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Thêm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity) || 1;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Kiểm tra số lượng tồn kho
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Khởi tạo giỏ hàng nếu chưa có
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = req.session.cart.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex !== -1) {
      // Cập nhật số lượng nếu sản phẩm đã có trong giỏ
      const newQuantity =
        req.session.cart[existingItemIndex].quantity + quantity;

      // Kiểm tra số lượng mới không vượt quá tồn kho
      if (newQuantity > product.stock) {
        return res
          .status(400)
          .json({ message: "Cannot add more items than available in stock" });
      }

      req.session.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Thêm sản phẩm mới vào giỏ
      req.session.cart.push({
        productId: productId,
        quantity: quantity,
      });
    }

    // Lưu session
    await req.session.save();

    res.json({
      message: "Product added to cart successfully",
      cartCount: req.session.cart.length,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
};

// Cập nhật số lượng
exports.updateCart = (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  if (!req.session.cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const cartItem = req.session.cart.find(
    (item) => item.productId === productId
  );
  if (cartItem) {
    cartItem.quantity = quantity;
  }

  res.json({ message: "Cart updated" });
};

// Xóa khỏi giỏ hàng
exports.removeFromCart = (req, res) => {
  const productId = req.params.productId;

  if (!req.session.cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  req.session.cart = req.session.cart.filter(
    (item) => item.productId !== productId
  );
  res.json({ message: "Item removed from cart" });
};

// Trang thanh toán
exports.getCheckout = async (req, res) => {
  try {
    // Lấy giỏ hàng từ session
    const cart = req.session.cart || [];

    if (cart.length === 0) {
      req.flash("error", "Your cart is empty");
      return res.redirect("/cart");
    }

    // Lấy thông tin chi tiết sản phẩm từ database
    const cartItems = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        return {
          product,
          quantity: item.quantity,
        };
      })
    );

    // Tính tổng tiền
    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    res.render("user/checkout", {
      cartItems,
      total,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong");
    res.redirect("/cart");
  }
}; 