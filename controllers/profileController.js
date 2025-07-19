const bcrypt = require("bcryptjs");
const { User } = require("../models");

// Hiển thị trang hồ sơ
exports.getProfilePage = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    res.render("user/profile", {
      user: user,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to load profile");
    res.redirect("/");
  }
};

// Cập nhật hồ sơ
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      birthdate,
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // Kiểm tra cơ bản
    if (!name || !email) {
      req.flash("error", "Name and email are required");
      return res.redirect("/profile");
    }

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.flash("error", "Please enter a valid email address");
      return res.redirect("/profile");
    }

    // Kiểm tra số điện thoại (nếu có)
    if (phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        req.flash("error", "Please enter a valid 10-digit phone number");
        return res.redirect("/profile");
      }
    }

    const user = await User.findByPk(req.session.user.id);

    // Kiểm tra email đã được sử dụng bởi người dùng khác chưa
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        req.flash("error", "Email is already in use");
        return res.redirect("/profile");
      }
    }

    // Cập nhật thông tin cơ bản
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;
    user.birthdate = birthdate;

    // Xử lý thay đổi mật khẩu
    if (currentPassword && newPassword) {
      // Xác thực mật khẩu hiện tại
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        req.flash("error", "Current password is incorrect");
        return res.redirect("/profile");
      }

      // Kiểm tra mật khẩu mới
      if (newPassword.length < 6) {
        req.flash("error", "New password must be at least 6 characters long");
        return res.redirect("/profile");
      }

      // Kiểm tra mật khẩu mới trùng khớp
      if (newPassword !== confirmPassword) {
        req.flash("error", "New passwords do not match");
        return res.redirect("/profile");
      }

      // Mã hóa và thiết lập mật khẩu mới
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    // Cập nhật session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.flash("success", "Profile updated successfully");
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to update profile");
    res.redirect("/profile");
  }
}; 