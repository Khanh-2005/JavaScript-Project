const { Product, Category } = require("../models");
const { Op } = require("sequelize");

// Trang chủ
exports.getHomePage = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });
    const categories = await Category.findAll();
    res.render("user/home", {
      products,
      categories,
      user: req.session.user || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Danh sách sản phẩm với bộ lọc
exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let where = {};
    let order = [];

    if (category) {
      where.categoryId = category;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (sort) {
      switch (sort) {
        case "price_asc":
          order.push(["price", "ASC"]);
          break;
        case "price_desc":
          order.push(["price", "DESC"]);
          break;
      }
    }

    const products = await Product.findAll({
      where,
      order,
      include: [
        {
          model: Category,
          as: "category",
        },
      ],
    });

    res.render("user/products", {
      products,
      user: req.session.user || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
}; 